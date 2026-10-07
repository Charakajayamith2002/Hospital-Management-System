import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LabOrder, LabOrderDocument, LabResultItem } from './schemas/lab-order.schema';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectModel(LabOrder.name) private labOrderModel: Model<LabOrderDocument>,
  ) {}

  async createOrder(data: {
    patientId: string;
    orderedByDoctorId: string;
    testName: string;
    category: string;
    cost: number;
  }): Promise<LabOrderDocument> {
    const order = new this.labOrderModel({
      patientId: new Types.ObjectId(data.patientId),
      orderedByDoctorId: new Types.ObjectId(data.orderedByDoctorId),
      testName: data.testName,
      category: data.category,
      cost: data.cost,
      status: 'ORDERED',
    });
    return order.save();
  }

  async findAll(status?: string): Promise<LabOrderDocument[]> {
    const filter = status ? { status } : {};
    return this.labOrderModel
      .find(filter)
      .populate('patientId', 'fullName mrn gender contactNumber')
      .populate('orderedByDoctorId', 'fullName specialization')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<LabOrderDocument> {
    const order = await this.labOrderModel
      .findById(id)
      .populate('patientId')
      .populate('orderedByDoctorId', 'fullName specialization')
      .exec();
    if (!order) throw new NotFoundException('Lab order not found');
    return order;
  }

  async updateResults(id: string, data: {
    results: LabResultItem[];
    conclusion?: string;
    technicianNotes?: string;
  }): Promise<LabOrderDocument> {
    const order = await this.labOrderModel.findByIdAndUpdate(
      id,
      {
        $set: {
          results: data.results,
          conclusion: data.conclusion,
          technicianNotes: data.technicianNotes,
          status: 'COMPLETED',
          verifiedAt: new Date(),
        },
      },
      { new: true },
    );
    if (!order) throw new NotFoundException('Lab order not found');
    return order;
  }

  async updateStatus(id: string, status: string): Promise<LabOrderDocument> {
    const order = await this.labOrderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) throw new NotFoundException('Lab order not found');
    return order;
  }
}

