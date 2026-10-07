import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsDateString()
  appointmentDate: string;

  @IsNotEmpty()
  @IsString()
  slotTime: string;

  @IsOptional()
  @IsEnum(['OPD', 'FOLLOW_UP', 'EMERGENCY'])
  type?: string;
}

export class UpdateConsultationDto {
  @IsOptional()
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    spO2?: number;
    weight?: number;
  };

  @IsOptional()
  prescription?: {
    diagnosis: string;
    medications: Array<{
      medicineName: string;
      dosage: string;
      frequency: string;
      durationDays: number;
      instructions?: string;
    }>;
    notes?: string;
  };
}

