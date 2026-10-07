import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: userData.email });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findByEmail(email: string, includePassword = false): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+passwordHash');
    }
    return query.exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(role?: Role): Promise<UserDocument[]> {
    const filter = role ? { role } : {};
    return this.userModel.find(filter).exec();
  }

  async findDoctors(): Promise<UserDocument[]> {
    return this.userModel.find({ role: Role.DOCTOR, isActive: true }).exec();
  }
}

