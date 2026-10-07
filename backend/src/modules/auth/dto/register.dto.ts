import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  department?: string;
}

