import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageReadDto } from './create-message-read.dto';

export class UpdateMessageReadDto extends PartialType(CreateMessageReadDto) {}
