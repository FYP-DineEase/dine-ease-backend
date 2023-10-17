import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';

// JWT
import {
  JwtMailService,
  EmailTokenTypes,
  UserDetails,
  AvatarUploadedEvent,
} from '@dine_ease/common';

// NATS
import { AccountCreatedEvent } from '@dine_ease/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.entity';

// DTO
import { AuthDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class RestaurantService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
}
