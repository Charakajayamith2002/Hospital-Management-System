export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'PHARMACIST' | 'LAB_TECH' | 'RECEPTIONIST' | 'PATIENT';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  specialization?: string;
  department?: string;
}

export interface Patient {
  _id: string;
  mrn: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  contactNumber: string;
  email?: string;
  allergies: string[];
  chronicConditions: string[];
  createdAt: string;
}

export interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    fullName: string;
    mrn: string;
    contactNumber: string;
  };
  doctorId: {
    _id: string;
    fullName: string;
    specialization?: string;
  };
  appointmentDate: string;
  slotTime: string;
  tokenNumber: number;
  type: string;
  status: 'SCHEDULED' | 'CHECKED_IN' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    spO2?: number;
  };
  prescription?: {
    diagnosis: string;
    medications: Array<{
      medicineName: string;
      dosage: string;
      frequency: string;
      durationDays: number;
    }>;
  };
}

export interface Bed {
  _id: string;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  dailyRate: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  currentPatientId?: {
    _id: string;
    fullName: string;
    mrn: string;
  } | null;
}

export interface Medicine {
  _id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
}

export interface LabOrder {
  _id: string;
  patientId: {
    _id: string;
    fullName: string;
    mrn: string;
  };
  testName: string;
  category: string;
  cost: number;
  status: 'ORDERED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  conclusion?: string;
  verifiedAt?: string;
}

export interface Bill {
  _id: string;
  invoiceNumber: string;
  patientId: {
    _id: string;
    fullName: string;
    mrn: string;
  };
  items: Array<{
    itemType: string;
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  paymentMethod: string;
  createdAt: string;
}

