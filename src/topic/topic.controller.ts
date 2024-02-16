import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(@Body() createTopicDto: CreateTopicDto):Promise<Topic> {
    return this.topicService.create(createTopicDto);
  }

  @Get()
  findAll():Promise<Topic[]> {
    return this.topicService.findAll();
  }

  @Get('/get-one/:id')
  findOne(@Param('id') id:number):Promise<Topic> {
    return this.topicService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: number, @Body() updateTopicDto: UpdateTopicDto):Promise<Topic> {
    return this.topicService.update(+id, updateTopicDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: number) {
    return this.topicService.remove(+id);
  }
}
