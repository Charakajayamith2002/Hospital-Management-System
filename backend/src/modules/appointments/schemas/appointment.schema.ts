import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ _id: false })
export class Vitals {
  @Prop()
  bloodPressure?: string; // e.g. 120/80

  @Prop()
  heartRate?: number; // bpm

  @Prop()
  temperature?: number; // Celsius

  @Prop()
  spO2?: number; // %

  @Prop()
  weight?: number; // kg
}

@Schema({ _id: false })
export class PrescriptionItem {
  @Prop({ required: true })
  medicineName: string;

  @Prop({ required: true })
  dosage: string; // e.g. 500mg

  @Prop({ required: true })
  frequency: string; // e.g. 1-0-1 (BID)

  @Prop({ required: true })
  durationDays: number;

  @Prop()
  instructions?: string; // e.g. After meals
}

@Schema({ _id: false })
export class Prescription {
  @Prop({ default: '' })
  diagnosis: string;

  @Prop({ type: [PrescriptionItem], default: [] })
  medications: PrescriptionItem[];

  @Prop()
  notes?: string;
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true, index: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  slotTime: string;

  @Prop({ required: true })
  tokenNumber: number;

  @Prop({ enum: ['OPD', 'FOLLOW_UP', 'EMERGENCY'], default: 'OPD' })
  type: string;

  @Prop({
    enum: ['SCHEDULED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED',
    index: true,
  })
  status: string;

  @Prop({ type: Vitals })
  vitals?: Vitals;

  @Prop({ type: Prescription })
  prescription?: Prescription;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Compound index to prevent double bookings
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1, slotTime: 1 });

