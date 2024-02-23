import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) { }
  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      return await this.eventRepository.save({
        ...createEventDto,
        status: 0,

      })
    } catch (error) {
      return error
    }
  }

  async findAll(): Promise<Event[]> {
    try {
      return await this.eventRepository.createQueryBuilder('event')
        .leftJoinAndMapOne('event.user', User, 'user', 'user.id = event.user')
        .orderBy(
          {
            create_at: 'DESC'
          }
        )
        .getMany()
    } catch (error) {
      return error;
    }
  }

  async findByUser(id: number): Promise<Event[]> {
    try {
      return await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndMapOne('event.user', User, 'user', 'user.id = event.user')
        .where({
          user: id
        })
        .orderBy(
          {
            create_at: 'DESC'
          }
        )
        .getMany()
    } catch (error) {
      return error;
    }
  }

  async findBrowseEvent(): Promise<Event[]> {
    try {
      return await this.eventRepository.find({
        where: {
          status: 0
        },
        order: {
          create_at: 'DESC'
        }
      });
    } catch (error) {
      return error;
    }
  }

  async BrowseRejectEvent(id: number): Promise<string> {
    try {

      await this.eventRepository.
        createQueryBuilder()
        .update(Event)
        .set({ status: 2 })
        .where("id = :id", { id: id })
        .orderBy({
          create_at: 'DESC'
        })
        .execute()

      return 'rejected'
    } catch (error) {
      return error;
    }
  }

  async BrowseAcceptanceEvent(id: number): Promise<string> {
    try {
      await this.eventRepository.createQueryBuilder()
        .update(Event)
        .set({ status: 2 })
        .where("id = :id", { id: id })
        .execute()

      return 'accepted'
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number): Promise<Event> {
    try {
      return await this.eventRepository.findOne({
        where: {
          id: id
        },
      });
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.eventRepository.findOne({
        where: {
          id: id
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
