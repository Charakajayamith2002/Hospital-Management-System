import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MedicineDocument = Medicine & Document;

@Schema({ timestamps: true })
export class Medicine {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  genericName: string;

  @Prop({ required: true, trim: true })
  category: string; // e.g. Antibiotic, Analgesic, Antacid, Cardiovascular

  @Prop({ required: true, trim: true })
  dosageForm: string; // e.g. Tablet, Syrup, Injection, Capsule

  @Prop({ required: true, trim: true })
  strength: string; // e.g. 500mg, 100ml

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, default: 0, min: 0 })
  stockQuantity: number;

  @Prop({ required: true, default: 20 })
  reorderLevel: number;

  @Prop({ required: true })
  batchNumber: string;

  @Prop({ required: true })
  expiryDate: Date;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);

MedicineSchema.index({ name: 'text', genericName: 'text' });

