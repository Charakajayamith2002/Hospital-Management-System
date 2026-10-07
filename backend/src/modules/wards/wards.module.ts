import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bed, BedSchema } from './schemas/bed.schema';
import { Admission, AdmissionSchema } from './schemas/admission.schema';
import { WardsService } from './wards.service';
import { WardsController } from './wards.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bed.name, schema: BedSchema },
      { name: Admission.name, schema: AdmissionSchema },
    ]),
  ],
  providers: [WardsService],
  controllers: [WardsController],
  exports: [WardsService],
})
export class WardsModule {}

