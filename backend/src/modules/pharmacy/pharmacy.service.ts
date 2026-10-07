import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  async create(createDto: CreateMedicineDto): Promise<MedicineDocument> {
    const medicine = new this.medicineModel({
      ...createDto,
      expiryDate: new Date(createDto.expiryDate),
    });
    return medicine.save();
  }

  async findAll(search?: string, lowStock?: boolean): Promise<MedicineDocument[]> {
    const query: any = {};
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (lowStock) {
      query.$expr = { $lte: ['$stockQuantity', '$reorderLevel'] };
    }
    return this.medicineModel.find(query).sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<MedicineDocument> {
    const med = await this.medicineModel.findById(id).exec();
    if (!med) throw new NotFoundException('Medicine not found');
    return med;
  }

  async dispense(id: string, quantity: number): Promise<MedicineDocument> {
    const updated = await this.medicineModel.findOneAndUpdate(
      { _id: id, stockQuantity: { $gte: quantity } },
      { $inc: { stockQuantity: -quantity } },
      { new: true },
    );
    if (!updated) {
      throw new BadRequestException('Insufficient stock or medicine not found');
    }
    return updated;
  }

  async updateStock(id: string, additionalQty: number): Promise<MedicineDocument> {
    const updated = await this.medicineModel.findByIdAndUpdate(
      id,
      { $inc: { stockQuantity: additionalQty } },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Medicine not found');
    return updated;
  }
}

