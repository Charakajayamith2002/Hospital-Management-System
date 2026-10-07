import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bill, BillDocument, BillLineItem } from './schemas/bill.schema';
import { Counter, CounterDocument } from '../patients/schemas/counter.schema';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
  ) {}

  private async getNextInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const sequenceDoc = await this.counterModel.findOneAndUpdate(
      { sequenceName: `inv_${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    const padded = String(sequenceDoc.seq).padStart(5, '0');
    return `INV-${year}-${padded}`;
  }

  async createBill(data: {
    patientId: string;
    items: BillLineItem[];
    discount?: number;
    tax?: number;
  }): Promise<BillDocument> {
    const invoiceNumber = await this.getNextInvoiceNumber();

    const subtotal = data.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const discount = data.discount || 0;
    const tax = data.tax || 0;
    const totalAmount = Math.max(0, subtotal - discount + tax);

    const bill = new this.billModel({
      invoiceNumber,
      patientId: new Types.ObjectId(data.patientId),
      items: data.items.map(item => ({
        ...item,
        total: item.unitPrice * item.quantity,
      })),
      subtotal,
      discount,
      tax,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'UNPAID',
    });

    return bill.save();
  }

  async recordPayment(
    id: string,
    amount: number,
    paymentMethod: string,
  ): Promise<BillDocument> {
    const bill = await this.billModel.findById(id);
    if (!bill) throw new NotFoundException('Invoice not found');

    const newPaidAmount = bill.paidAmount + amount;
    if (newPaidAmount > bill.totalAmount) {
      throw new BadRequestException('Payment amount exceeds total balance');
    }

    bill.paidAmount = newPaidAmount;
    bill.paymentMethod = paymentMethod;
    bill.paymentStatus = newPaidAmount >= bill.totalAmount ? 'PAID' : 'PARTIALLY_PAID';

    return bill.save();
  }

  async findAll(status?: string): Promise<BillDocument[]> {
    const filter = status ? { paymentStatus: status } : {};
    return this.billModel
      .find(filter)
      .populate('patientId', 'fullName mrn contactNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<BillDocument> {
    const bill = await this.billModel
      .findById(id)
      .populate('patientId')
      .exec();
    if (!bill) throw new NotFoundException('Invoice not found');
    return bill;
  }

  async getRevenueStats() {
    const totalRevenue = await this.billModel.aggregate([
      { $group: { _id: null, totalCollected: { $sum: '$paidAmount' }, totalBilled: { $sum: '$totalAmount' } } },
    ]);
    return totalRevenue[0] || { totalCollected: 0, totalBilled: 0 };
  }
}

