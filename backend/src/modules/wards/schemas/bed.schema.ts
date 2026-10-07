import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BedDocument = Bed & Document;

@Schema({ timestamps: true })
export class Bed {
  @Prop({ required: true, trim: true })
  wardName: string; // e.g. "General Ward A", "ICU", "Post-Op", "Private Suite"

  @Prop({ required: true, trim: true })
  roomNumber: string;

  @Prop({ required: true, trim: true })
  bedNumber: string;

  @Prop({ required: true, default: 100 })
  dailyRate: number;

  @Prop({
    enum: ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE'],
    default: 'AVAILABLE',
    index: true,
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Patient', default: null })
  currentPatientId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Admission', default: null })
  currentAdmissionId: Types.ObjectId | null;
}

export const BedSchema = SchemaFactory.createForClass(Bed);

// Unique constraint per room and bed
BedSchema.index({ wardName: 1, roomNumber: 1, bedNumber: 1 }, { unique: true });

