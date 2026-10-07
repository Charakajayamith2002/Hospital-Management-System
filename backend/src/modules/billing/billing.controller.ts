import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { BillLineItem } from './schemas/bill.schema';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async createBill(@Body() body: {
    patientId: string;
    items: BillLineItem[];
    discount?: number;
    tax?: number;
  }) {
    return this.billingService.createBill(body);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async findAll(@Query('status') status?: string) {
    return this.billingService.findAll(status);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  async getRevenueStats() {
    return this.billingService.getRevenueStats();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.billingService.findById(id);
  }

  @Patch(':id/pay')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async recordPayment(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    return this.billingService.recordPayment(id, amount, paymentMethod);
  }
}

