import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Medicine, MedicineSchema } from './schemas/medicine.schema';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
    ]),
  ],
  providers: [PharmacyService],
  controllers: [PharmacyController],
  exports: [PharmacyService],
})
export class PharmacyModule {}

