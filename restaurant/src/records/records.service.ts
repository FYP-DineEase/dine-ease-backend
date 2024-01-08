import { Injectable } from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Record, RecordDocument } from './models/record.entity';

// DTO
import { CreateRecordDto } from './dto/create.dto';
import { RestaurantIdDto } from './dto/mongo-id.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordsModel: Model<RecordDocument>,
  ) {}

  // all records
  async getRecords(): Promise<RecordDocument[]> {
    const records: RecordDocument[] = await this.recordsModel.find();
    return records;
  }

  // restaurant records
  async getRestaurantRecords(
    restaurantIdDto: RestaurantIdDto,
  ): Promise<RecordDocument[]> {
    const { restaurantId } = restaurantIdDto;
    const records: RecordDocument[] = await this.recordsModel.find({
      restaurantId,
    });
    return records;
  }

  // create a record
  async createRecord(createRecordDto: CreateRecordDto): Promise<void> {
    this.recordsModel.create(createRecordDto);
  }
}
