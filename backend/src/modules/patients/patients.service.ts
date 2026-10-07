import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { Counter, CounterDocument } from './schemas/counter.schema';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
  ) {}

  private async getNextMRN(): Promise<string> {
    const year = new Date().getFullYear();
    const sequenceDoc = await this.counterModel.findOneAndUpdate(
      { sequenceName: `mrn_${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    const padded = String(sequenceDoc.seq).padStart(5, '0');
    return `MRN-${year}-${padded}`;
  }

  async create(createPatientDto: CreatePatientDto): Promise<PatientDocument> {
    const mrn = await this.getNextMRN();
    const newPatient = new this.patientModel({
      ...createPatientDto,
      mrn,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
    });
    return newPatient.save();
  }

  async findAll(search?: string): Promise<PatientDocument[]> {
    if (search && search.trim()) {
      return this.patientModel.find({
        $or: [
          { mrn: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
          { contactNumber: { $regex: search, $options: 'i' } },
        ],
      }).sort({ createdAt: -1 }).limit(100).exec();
    }
    return this.patientModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  async findById(id: string): Promise<PatientDocument> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async findByMRN(mrn: string): Promise<PatientDocument> {
    const patient = await this.patientModel.findOne({ mrn }).exec();
    if (!patient) throw new NotFoundException(`Patient with MRN ${mrn} not found`);
    return patient;
  }

  async count(): Promise<number> {
    return this.patientModel.countDocuments().exec();
  }
}

