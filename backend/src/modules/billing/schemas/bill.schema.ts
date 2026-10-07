import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema({ _id: false })
export class BillLineItem {
  @Prop({ required: true, enum: ['CONSULTATION', 'BED_CHARGE', 'PHARMACY', 'LAB_TEST', 'PROCEDURE', 'OTHER'] })
  itemType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  total: number;
}

@Schema({ timestamps: true })
export class Bill {
  @Prop({ required: true, unique: true, index: true })
  invoiceNumber: string; // e.g. INV-2026-0001

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true, index: true })
  patientId: Types.ObjectId;

  @Prop({ type: [BillLineItem], default: [] })
  items: BillLineItem[];

  @Prop({ required: true, default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ required: true, default: 0 })
  totalAmount: number;

  @Prop({ default: 0 })
  paidAmount: number;

  @Prop({
    enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID'],
    default: 'UNPAID',
    index: true,
  })
  paymentStatus: string;

  @Prop({ enum: ['CASH', 'CARD', 'UPI', 'INSURANCE', 'PENDING'], default: 'PENDING' })
  paymentMethod: string;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

