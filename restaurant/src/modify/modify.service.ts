import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ModifyRequest, ModifyRequestDocument } from './models/request.entity';

// DTO
import { RequestIdDto, RestaurantIdDto } from './dto/mongo-id.dto';
import { CreateReqeustDto } from './dto/create.dto';
import { UserDetails } from '@dine_ease/common';
import { PrimaryDetailsDto } from 'src/restaurants/dto/primary-details.dto';

@Injectable()
export class ModifyService {
  constructor(
    @InjectModel(ModifyRequest.name)
    private modifyModel: Model<ModifyRequestDocument>,
  ) {}

  // all requests
  async getRequests(): Promise<ModifyRequestDocument[]> {
    const requests: ModifyRequestDocument[] = await this.modifyModel.find();
    return requests;
  }

  // find modify request
  async restaurantRequest(
    idDto: RestaurantIdDto,
  ): Promise<ModifyRequestDocument> {
    const { restaurantId } = idDto;
    const record: ModifyRequestDocument = await this.modifyModel.findOne({
      restaurantId,
    });

    if (!record) throw new NotFoundException('Request not found');
    return record;
  }

  // find duplicate data
  async findRestaurant(data: PrimaryDetailsDto, id?: string): Promise<void> {
    const { name, taxId } = data;

    const query: any = { $or: [{ name }, { taxId }] };
    if (id) query.restaurantId = { $ne: id };

    const found: ModifyRequestDocument = await this.modifyModel.findOne(query);
    if (found) throw new ConflictException(`Restaurant already exists`);
  }

  // create or update a modify request
  async createRequest(createRecordDto: CreateReqeustDto): Promise<string> {
    const { restaurantId } = createRecordDto;

    await this.modifyModel.findOneAndUpdate(
      { restaurantId },
      { $set: createRecordDto },
      { upsert: true },
    );

    return 'Modify request created successfully';
  }

  // delete request
  async deleteRequest(
    requestIdDto: RequestIdDto,
    user: UserDetails,
  ): Promise<string> {
    const { requestId } = requestIdDto;

    const record: ModifyRequestDocument = await this.modifyModel.findById(
      requestId,
    );

    if (!record) throw new NotFoundException('Request not found');

    if (record.userId === user.id) {
      await record.deleteOne();
      return 'Request deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
