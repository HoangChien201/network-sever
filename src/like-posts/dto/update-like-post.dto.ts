import { PartialType } from '@nestjs/mapped-types';
import { CreateLikePostDto } from './create-like-post.dto';

export class UpdateLikePostDto extends PartialType(CreateLikePostDto) {}
