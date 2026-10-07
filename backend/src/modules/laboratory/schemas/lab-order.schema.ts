import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LabOrderDocument = LabOrder & Document;

@Schema({ _id: false })
export class LabResultItem {
  @Prop({ required: true })
  parameter: string; // e.g. "Hemoglobin", "WBC Count"

  @Prop({ required: true })
  value: string; // e.g. "14.2"

  @Prop()
  unit?: string; // e.g. "g/dL"

  @Prop()
  referenceRange?: string; // e.g. "13.0 - 17.0"

  @Prop({ default: false })
  isAbnormal: boolean;
}

@Schema({ timestamps: true })
export class LabOrder {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true, index: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  orderedByDoctorId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  testName: string;

  @Prop({ required: true, trim: true })
  category: string; // Hematology, Biochemistry, Radiology, Microbiology

  @Prop({ required: true, default: 50 })
  cost: number;

  @Prop({
    enum: ['ORDERED', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
    default: 'ORDERED',
    index: true,
  })
  status: string;

  @Prop({ type: [LabResultItem], default: [] })
  results: LabResultItem[];

  @Prop()
  conclusion?: string;

  @Prop()
  technicianNotes?: string;

  @Prop({ default: null })
  verifiedAt: Date | null;
}

export const LabOrderSchema = SchemaFactory.createForClass(LabOrder);

