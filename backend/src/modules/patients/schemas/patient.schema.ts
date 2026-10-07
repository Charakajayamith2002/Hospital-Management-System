import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ _id: false })
export class EmergencyContact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  relationship: string;

  @Prop({ required: true })
  phone: string;
}

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, unique: true, index: true })
  mrn: string; // Medical Record Number (e.g. MRN-2026-0001)

  @Prop({ required: true, trim: true, index: true })
  fullName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender: string;

  @Prop({ enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] })
  bloodGroup?: string;

  @Prop({ required: true, trim: true, index: true })
  contactNumber: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop()
  address?: string;

  @Prop({ type: EmergencyContact })
  emergencyContact?: EmergencyContact;

  @Prop({ type: [String], default: [] })
  allergies: string[];

  @Prop({ type: [String], default: [] })
  chronicConditions: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

// Create compound text index for ultra-fast multi-field patient searching
PatientSchema.index({ fullName: 'text', contactNumber: 'text', mrn: 'text' });

