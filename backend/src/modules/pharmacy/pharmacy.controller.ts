import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('medicines')
  @Roles(Role.ADMIN, Role.PHARMACIST)
  async create(@Body() createDto: CreateMedicineDto) {
    return this.pharmacyService.create(createDto);
  }

  @Get('medicines')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PHARMACIST, Role.NURSE)
  async findAll(
    @Query('search') search?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.pharmacyService.findAll(search, lowStock === 'true');
  }

  @Post('medicines/:id/dispense')
  @Roles(Role.ADMIN, Role.PHARMACIST)
  async dispense(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.pharmacyService.dispense(id, quantity);
  }

  @Patch('medicines/:id/restock')
  @Roles(Role.ADMIN, Role.PHARMACIST)
  async restock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.pharmacyService.updateStock(id, quantity);
  }
}

