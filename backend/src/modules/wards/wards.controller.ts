import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { WardsService } from './wards.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { NursingVitalsLog } from './schemas/admission.schema';

@Controller('wards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get('beds')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.RECEPTIONIST)
  async getAllBeds() {
    return this.wardsService.getAllBeds();
  }

  @Post('beds')
  @Roles(Role.ADMIN)
  async createBed(@Body() body: any) {
    return this.wardsService.createBed(body);
  }

  @Patch('beds/:id/status')
  @Roles(Role.ADMIN, Role.NURSE)
  async updateBedStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.wardsService.updateBedStatus(id, status);
  }

  @Get('admissions/active')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
  async getActiveAdmissions() {
    return this.wardsService.getActiveAdmissions();
  }

  @Post('admit')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async admitPatient(@Body() body: {
    patientId: string;
    bedId: string;
    admittingDoctorId: string;
    admissionReason: string;
  }) {
    return this.wardsService.admitPatient(body);
  }

  @Post('admissions/:id/discharge')
  @Roles(Role.ADMIN, Role.DOCTOR)
  async dischargePatient(
    @Param('id') id: string,
    @Body('summary') summary: string,
  ) {
    return this.wardsService.dischargePatient(id, summary);
  }

  @Post('admissions/:id/vitals')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE)
  async addVitals(
    @Param('id') id: string,
    @Body() vitals: NursingVitalsLog,
  ) {
    return this.wardsService.addVitals(id, vitals);
  }
}
