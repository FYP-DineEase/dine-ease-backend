import { Injectable } from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Record, RecordDocument } from './models/record.entity';

// DTO
import { CreateRecordDto } from './dto/create.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private recordsModel: Model<RecordDocument>,
  ) {}

  // all records
  async getRecords(): Promise<RecordDocument[]> {
    const records: RecordDocument[] = await this.recordsModel.find();
    return records;
  }

  // create a record
  async createRecord(createRecordDto: CreateRecordDto): Promise<void> {
    this.recordsModel.create(createRecordDto);
  }
}
