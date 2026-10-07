import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, enum: Role, default: Role.PATIENT })
  role: Role;

  @Prop({ trim: true })
  phoneNumber?: string;

  @Prop({ trim: true })
  specialization?: string; // For doctors (e.g. Cardiology, Neurology)

  @Prop({ trim: true })
  department?: string; // e.g. Emergency, Inpatient, Diagnostics

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

