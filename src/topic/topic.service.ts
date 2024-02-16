import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>
  ) { }
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    try {
      return await this.topicRepository.save(createTopicDto)
    } catch (error) {
      return error
    }
  }

  async findAll(): Promise<Topic[]> {
    try {
      return await this.topicRepository.find();
    } catch (error) {
      return error;
    }
  }

  async findOne(id:number): Promise<Topic> {
    try {
      return await this.topicRepository.findOne({
        where:{
          id:id
        },
        relations:{
          events:true
        }
      });
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    try {
      const topic= await this.topicRepository.findOne({
        where:{
          id:id
        }
      })
      return await this.topicRepository.save(
        {
          ...topic,
          ...updateTopicDto
        }
      );
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      await this.topicRepository.delete(id);
      return 'delete success'
    } catch (error) {
      return error;
    }
  }
}
