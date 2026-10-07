import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdmissionDocument = Admission & Document;

@Schema({ _id: false })
export class NursingVitalsLog {
  @Prop({ default: () => new Date() })
  recordedAt: Date;

  @Prop({ required: true })
  bloodPressure: string;

  @Prop({ required: true })
  heartRate: number;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  spO2: number;

  @Prop({ required: true })
  nurseName: string;

  @Prop()
  notes?: string;
}

@Schema({ timestamps: true })
export class Admission {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true, index: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bed', required: true })
  bedId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  admittingDoctorId: Types.ObjectId;

  @Prop({ default: () => new Date() })
  admittedAt: Date;

  @Prop({ default: null })
  dischargedAt: Date | null;

  @Prop({ required: true })
  admissionReason: string;

  @Prop({ default: '' })
  dischargeSummary?: string;

  @Prop({
    enum: ['ADMITTED', 'DISCHARGED', 'TRANSFERRED'],
    default: 'ADMITTED',
    index: true,
  })
  status: string;

  @Prop({ type: [NursingVitalsLog], default: [] })
  vitalsHistory: NursingVitalsLog[];
}

export const AdmissionSchema = SchemaFactory.createForClass(Admission);

