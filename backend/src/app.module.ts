import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { WardsModule } from './modules/wards/wards.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { LaboratoryModule } from './modules/laboratory/laboratory.module';
import { BillingModule } from './modules/billing/billing.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://127.0.0.1:27017/hms_db',
      }),
    }),
    AuthModule,
    UsersModule,
    PatientsModule,
    AppointmentsModule,
    WardsModule,
    PharmacyModule,
    LaboratoryModule,
    BillingModule,
    SeedModule,
  ],
})
export class AppModule {}

