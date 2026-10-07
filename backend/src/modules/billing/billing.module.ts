import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schemas/bill.schema';
import { Counter, CounterSchema } from '../patients/schemas/counter.schema';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}

