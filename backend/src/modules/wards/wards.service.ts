import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bed, BedDocument } from './schemas/bed.schema';
import { Admission, AdmissionDocument, NursingVitalsLog } from './schemas/admission.schema';

@Injectable()
export class WardsService {
  constructor(
    @InjectModel(Bed.name) private bedModel: Model<BedDocument>,
    @InjectModel(Admission.name) private admissionModel: Model<AdmissionDocument>,
  ) {}

  async getAllBeds(): Promise<BedDocument[]> {
    return this.bedModel
      .find()
      .populate('currentPatientId', 'fullName mrn gender')
      .sort({ wardName: 1, roomNumber: 1, bedNumber: 1 })
      .exec();
  }

  async createBed(data: Partial<Bed>): Promise<BedDocument> {
    const bed = new this.bedModel(data);
    return bed.save();
  }

  async updateBedStatus(id: string, status: string): Promise<BedDocument> {
    const bed = await this.bedModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!bed) throw new NotFoundException('Bed not found');
    return bed;
  }

  async admitPatient(dto: {
    patientId: string;
    bedId: string;
    admittingDoctorId: string;
    admissionReason: string;
  }): Promise<AdmissionDocument> {
    // Atomic check and occupy bed
    const bed = await this.bedModel.findOneAndUpdate(
      { _id: new Types.ObjectId(dto.bedId), status: 'AVAILABLE' },
      {
        $set: {
          status: 'OCCUPIED',
          currentPatientId: new Types.ObjectId(dto.patientId),
        },
      },
      { new: true },
    );

    if (!bed) {
      throw new BadRequestException('Selected bed is no longer available');
    }

    const admission = new this.admissionModel({
      patientId: new Types.ObjectId(dto.patientId),
      bedId: new Types.ObjectId(dto.bedId),
      admittingDoctorId: new Types.ObjectId(dto.admittingDoctorId),
      admissionReason: dto.admissionReason,
      status: 'ADMITTED',
    });

    const savedAdmission = await admission.save();

    // Link admission to bed
    await this.bedModel.findByIdAndUpdate(dto.bedId, {
      currentAdmissionId: savedAdmission._id,
    });

    return savedAdmission;
  }

  async dischargePatient(admissionId: string, summary: string): Promise<AdmissionDocument> {
    const admission = await this.admissionModel.findById(admissionId);
    if (!admission || admission.status === 'DISCHARGED') {
      throw new NotFoundException('Active admission not found');
    }

    admission.status = 'DISCHARGED';
    admission.dischargedAt = new Date();
    admission.dischargeSummary = summary;
    await admission.save();

    // Release bed to CLEANING status
    await this.bedModel.findByIdAndUpdate(admission.bedId, {
      status: 'CLEANING',
      currentPatientId: null,
      currentAdmissionId: null,
    });

    return admission;
  }

  async addVitals(admissionId: string, vitals: NursingVitalsLog): Promise<AdmissionDocument> {
    const admission = await this.admissionModel.findByIdAndUpdate(
      admissionId,
      { $push: { vitalsHistory: vitals } },
      { new: true },
    );
    if (!admission) throw new NotFoundException('Admission not found');
    return admission;
  }

  async getActiveAdmissions(): Promise<AdmissionDocument[]> {
    return this.admissionModel
      .find({ status: 'ADMITTED' })
      .populate('patientId', 'fullName mrn gender contactNumber dateOfBirth')
      .populate('bedId')
      .populate('admittingDoctorId', 'fullName specialization')
      .sort({ admittedAt: -1 })
      .exec();
  }
}

