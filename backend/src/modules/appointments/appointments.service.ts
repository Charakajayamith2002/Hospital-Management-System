import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto, UpdateConsultationDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(createDto: CreateAppointmentDto): Promise<AppointmentDocument> {
    const appDate = new Date(createDto.appointmentDate);
    const startOfDay = new Date(appDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check slot conflict for doctor
    const existing = await this.appointmentModel.findOne({
      doctorId: new Types.ObjectId(createDto.doctorId),
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      slotTime: createDto.slotTime,
      status: { $ne: 'CANCELLED' },
    });

    if (existing) {
      throw new ConflictException('Doctor is already booked for this time slot');
    }

    // Get today's token number for this doctor
    const tokenCount = await this.appointmentModel.countDocuments({
      doctorId: new Types.ObjectId(createDto.doctorId),
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const tokenNumber = tokenCount + 1;

    const appointment = new this.appointmentModel({
      patientId: new Types.ObjectId(createDto.patientId),
      doctorId: new Types.ObjectId(createDto.doctorId),
      appointmentDate: appDate,
      slotTime: createDto.slotTime,
      tokenNumber,
      type: createDto.type || 'OPD',
      status: 'SCHEDULED',
    });

    return appointment.save();
  }

  async findAll(filter: { date?: string; doctorId?: string; status?: string }): Promise<AppointmentDocument[]> {
    const query: any = {};
    if (filter.doctorId) {
      query.doctorId = new Types.ObjectId(filter.doctorId);
    }
    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.date) {
      const targetDate = new Date(filter.date);
      const start = new Date(targetDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(targetDate);
      end.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: start, $lte: end };
    }

    return this.appointmentModel
      .find(query)
      .populate('patientId', 'fullName mrn contactNumber gender dateOfBirth')
      .populate('doctorId', 'fullName specialization department')
      .sort({ appointmentDate: 1, tokenNumber: 1 })
      .exec();
  }

  async findById(id: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('patientId')
      .populate('doctorId', 'fullName specialization department')
      .exec();
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async updateStatus(id: string, status: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async updateConsultation(id: string, updateDto: UpdateConsultationDto): Promise<AppointmentDocument> {
    const updateData: any = {};
    if (updateDto.vitals) updateData.vitals = updateDto.vitals;
    if (updateDto.prescription) {
      updateData.prescription = updateDto.prescription;
      updateData.status = 'COMPLETED';
    }

    const updated = await this.appointmentModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Appointment not found');
    return updated;
  }
}

