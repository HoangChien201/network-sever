import { PartialType } from '@nestjs/mapped-types';
import { CreateTagPostDto } from './create-tag-post.dto';

export class UpdateTagPostDto extends PartialType(CreateTagPostDto) {}
