import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.NURSE)
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.NURSE, Role.PHARMACIST, Role.LAB_TECH)
  async findAll(@Query('search') search?: string) {
    return this.patientsService.findAll(search);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.NURSE, Role.PHARMACIST, Role.LAB_TECH)
  async findById(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }
}

