import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Bed, BedDocument } from '../wards/schemas/bed.schema';
import { Medicine, MedicineDocument } from '../pharmacy/schemas/medicine.schema';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Bed.name) private bedModel: Model<BedDocument>,
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedUsers();
    await this.seedBeds();
    await this.seedMedicines();
  }

  private async seedUsers() {
    const count = await this.userModel.countDocuments();
    if (count > 0) return;

    this.logger.log('Seeding initial hospital staff and admin accounts...');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Hospital@123', salt);

    const users = [
      {
        fullName: 'Dr. Arthur Vance (Medical Director / Admin)',
        email: 'admin@hospital.com',
        passwordHash: defaultPassword,
        role: Role.ADMIN,
        department: 'Hospital Administration',
        phoneNumber: '+94 11 234 5678',
      },
      {
        fullName: 'Dr. Sarah Connor (Consultant Cardiologist)',
        email: 'doctor.sarah@hospital.com',
        passwordHash: defaultPassword,
        role: Role.DOCTOR,
        department: 'Cardiology',
        specialization: 'Interventional Cardiology',
        phoneNumber: '+94 77 123 4567',
      },
      {
        fullName: 'Dr. James Wilson (Consultant Neurologist)',
        email: 'doctor.james@hospital.com',
        passwordHash: defaultPassword,
        role: Role.DOCTOR,
        department: 'Neurology',
        specialization: 'Clinical Neurology',
        phoneNumber: '+94 77 987 6543',
      },
      {
        fullName: 'Sister Emily Clarke (Head Nursing Officer)',
        email: 'nurse.emily@hospital.com',
        passwordHash: defaultPassword,
        role: Role.NURSE,
        department: 'Inpatient Care Units',
        phoneNumber: '+94 71 234 8901',
      },
      {
        fullName: 'Alex Mercer (Chief Pharmacist)',
        email: 'pharma.alex@hospital.com',
        passwordHash: defaultPassword,
        role: Role.PHARMACIST,
        department: 'Central Pharmacy Dispensary',
        phoneNumber: '+94 76 345 6789',
      },
      {
        fullName: 'David Miller (Medical Laboratory Technologist - MLT)',
        email: 'lab.david@hospital.com',
        passwordHash: defaultPassword,
        role: Role.LAB_TECH,
        department: 'Pathology & Diagnostic Laboratory',
        phoneNumber: '+94 75 456 7890',
      },
      {
        fullName: 'Lisa Watson (Cashier / Billing Counter & Reception)',
        email: 'reception.lisa@hospital.com',
        passwordHash: defaultPassword,
        role: Role.RECEPTIONIST,
        department: 'Accounts & Front Office',
        phoneNumber: '+94 11 234 5679',
      },
    ];

    await this.userModel.insertMany(users);
    this.logger.log('Initial hospital users created successfully!');
  }

  private async seedBeds() {
    const count = await this.bedModel.countDocuments();
    if (count > 0) return;

    this.logger.log('Seeding hospital wards and beds with Sri Lankan Rupee (LKR) tariffs...');
    const beds = [
      { wardName: 'Intensive Care Unit (ICU)', roomNumber: 'ICU-1', bedNumber: 'Bed-A', dailyRate: 35000, status: 'AVAILABLE' },
      { wardName: 'Intensive Care Unit (ICU)', roomNumber: 'ICU-1', bedNumber: 'Bed-B', dailyRate: 35000, status: 'AVAILABLE' },
      { wardName: 'General Ward A (Male)', roomNumber: 'GW-101', bedNumber: 'Bed-1', dailyRate: 3500, status: 'AVAILABLE' },
      { wardName: 'General Ward A (Male)', roomNumber: 'GW-101', bedNumber: 'Bed-2', dailyRate: 3500, status: 'AVAILABLE' },
      { wardName: 'General Ward B (Female)', roomNumber: 'GW-102', bedNumber: 'Bed-1', dailyRate: 3500, status: 'AVAILABLE' },
      { wardName: 'Pediatric Care Ward', roomNumber: 'PED-201', bedNumber: 'Bed-1', dailyRate: 6500, status: 'AVAILABLE' },
      { wardName: 'Private Deluxe Suite', roomNumber: 'DLX-301', bedNumber: 'Bed-A', dailyRate: 22000, status: 'AVAILABLE' },
    ];

    await this.bedModel.insertMany(beds);
    this.logger.log('Initial hospital beds created successfully with LKR pricing!');
  }

  private async seedMedicines() {
    const count = await this.medicineModel.countDocuments();
    if (count > 0) return;

    this.logger.log('Seeding pharmacy inventory with NMRA-registered items and LKR pricing...');
    const medicines = [
      {
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin Trihydrate',
        category: 'Antibiotic',
        dosageForm: 'Capsule',
        strength: '500mg',
        unitPrice: 45.0, // LKR 45.00 per capsule
        stockQuantity: 500,
        reorderLevel: 100,
        batchNumber: 'SL-AMX-2026',
        expiryDate: new Date('2027-12-31'),
      },
      {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        category: 'Analgesic & Antipyretic',
        dosageForm: 'Tablet',
        strength: '500mg',
        unitPrice: 7.5, // LKR 7.50 per tablet
        stockQuantity: 2500,
        reorderLevel: 200,
        batchNumber: 'SL-PCM-2026',
        expiryDate: new Date('2028-06-30'),
      },
      {
        name: 'Metformin 500mg',
        genericName: 'Metformin Hydrochloride',
        category: 'Antidiabetic',
        dosageForm: 'Tablet',
        strength: '500mg',
        unitPrice: 18.0, // LKR 18.00 per tablet
        stockQuantity: 1200,
        reorderLevel: 150,
        batchNumber: 'SL-MET-2026',
        expiryDate: new Date('2027-09-15'),
      },
      {
        name: 'Atorvastatin 20mg',
        genericName: 'Atorvastatin Calcium',
        category: 'Cardiovascular (Lipid-lowering)',
        dosageForm: 'Tablet',
        strength: '20mg',
        unitPrice: 65.0, // LKR 65.00 per tablet
        stockQuantity: 450,
        reorderLevel: 80,
        batchNumber: 'SL-ATV-2026',
        expiryDate: new Date('2027-05-20'),
      },
      {
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole Magnesium',
        category: 'Gastrointestinal (Proton Pump Inhibitor)',
        dosageForm: 'Capsule',
        strength: '20mg',
        unitPrice: 35.0, // LKR 35.00 per capsule
        stockQuantity: 800,
        reorderLevel: 100,
        batchNumber: 'SL-OMP-2026',
        expiryDate: new Date('2028-01-10'),
      },
      {
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine Dihydrochloride',
        category: 'Antihistamine',
        dosageForm: 'Tablet',
        strength: '10mg',
        unitPrice: 20.0, // LKR 20.00 per tablet
        stockQuantity: 15, // Below reorder level (alerts triggered)
        reorderLevel: 60,
        batchNumber: 'SL-CTZ-2026',
        expiryDate: new Date('2026-12-31'),
      },
    ];

    await this.medicineModel.insertMany(medicines);
    this.logger.log('Initial medicines seeded successfully in LKR!');
  }
}
