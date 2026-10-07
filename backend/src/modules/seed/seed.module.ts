import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Bed, BedSchema } from '../wards/schemas/bed.schema';
import { Medicine, MedicineSchema } from '../pharmacy/schemas/medicine.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Bed.name, schema: BedSchema },
      { name: Medicine.name, schema: MedicineSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}

