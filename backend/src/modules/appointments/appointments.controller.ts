import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateConsultationDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR)
  async create(@Body() createDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.RECEPTIONIST)
  async findAll(
    @Query('date') date?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
  ) {
    return this.appointmentsService.findAll({ date, doctorId, status });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.RECEPTIONIST)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @Patch(':id/consultation')
  @Roles(Role.ADMIN, Role.DOCTOR)
  async updateConsultation(
    @Param('id') id: string,
    @Body() updateDto: UpdateConsultationDto,
  ) {
    return this.appointmentsService.updateConsultation(id, updateDto);
  }
}

