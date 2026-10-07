import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabOrder, LabOrderSchema } from './schemas/lab-order.schema';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LabOrder.name, schema: LabOrderSchema },
    ]),
  ],
  providers: [LaboratoryService],
  controllers: [LaboratoryController],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}

