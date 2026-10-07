import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { LabResultItem } from './schemas/lab-order.schema';

@Controller('laboratory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post('orders')
  @Roles(Role.ADMIN, Role.DOCTOR)
  async createOrder(@Body() body: {
    patientId: string;
    orderedByDoctorId: string;
    testName: string;
    category: string;
    cost: number;
  }) {
    return this.laboratoryService.createOrder(body);
  }

  @Get('orders')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.LAB_TECH, Role.NURSE)
  async findAll(@Query('status') status?: string) {
    return this.laboratoryService.findAll(status);
  }

  @Get('orders/:id')
  async findById(@Param('id') id: string) {
    return this.laboratoryService.findById(id);
  }

  @Patch('orders/:id/status')
  @Roles(Role.ADMIN, Role.LAB_TECH)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.laboratoryService.updateStatus(id, status);
  }

  @Patch('orders/:id/results')
  @Roles(Role.ADMIN, Role.LAB_TECH)
  async updateResults(
    @Param('id') id: string,
    @Body() body: { results: LabResultItem[]; conclusion?: string; technicianNotes?: string },
  ) {
    return this.laboratoryService.updateResults(id, body);
  }
}

