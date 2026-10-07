import { IsNotEmpty, IsString, IsEnum, IsOptional, IsEmail, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EmergencyContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  relationship: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  dateOfBirth: string | Date;

  @IsNotEmpty()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @IsOptional()
  @IsArray()
  allergies?: string[];

  @IsOptional()
  @IsArray()
  chronicConditions?: string[];
}

