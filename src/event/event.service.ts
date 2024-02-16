import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) { }
  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      return await this.eventRepository.save(createEventDto)
    } catch (error) {
      return error
    }
  }

  async findAll(): Promise<Event[]> {
    try {
      return await this.eventRepository.find();
    } catch (error) {
      return error;
    }
  }

  async findOne(id:number): Promise<Event> {
    try {
      return await this.eventRepository.findOne({
        where:{
          id:id
        },
      });
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event= await this.eventRepository.findOne({
        where:{
          id:id
        }
      })
      return await this.eventRepository.save(
        {
          ...event,
          ...updateEventDto
        }
      );
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      await this.eventRepository.delete(id);
      return 'delete success'
    } catch (error) {
      return error;
    }
  }
}
