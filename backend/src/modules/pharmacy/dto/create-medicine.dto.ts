import { IsNotEmpty, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  genericName: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  dosageForm: string;

  @IsNotEmpty()
  @IsString()
  strength: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  reorderLevel: number;

  @IsNotEmpty()
  @IsString()
  batchNumber: string;

  @IsNotEmpty()
  @IsDateString()
  expiryDate: string;
}

