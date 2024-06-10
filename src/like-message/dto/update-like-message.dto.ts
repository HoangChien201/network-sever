import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeMessageDto } from './create-like-message.dto';

export class UpdateLikeMessageDto extends PartialType(CreateLikeMessageDto) {}
