import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { LikeMessage } from 'src/like-message/entities/like-message.entity';
import { MessageRead } from 'src/message-read/entities/message-read.entity';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message)
    private readonly messageReposity: Repository<Message>,
    @InjectRepository(LikeMessage)
    private readonly likeMessageReposity: Repository<LikeMessage>,
    @InjectRepository(MessageRead)
    private readonly messageReadReposity: Repository<MessageRead>,
    @InjectRepository(GroupChat)
    private readonly groupChatReposity: Repository<GroupChat>
  ) { }

  async create(createMessageDto: CreateMessageDto): Promise<any> {
    try {
      createMessageDto.state = 1;
      const messageCreate = await this.messageReposity.save(createMessageDto);
      const msg= await this.messageReposity.createQueryBuilder('m')
        .leftJoin('m.sender', 'sender')
        .addSelect(['sender.id', 'sender.fullname', 'sender.avatar'])
        .leftJoin('m.group', 'g')
        .addSelect(['g.id','g.name','g.type'])
        .where(`m.id = ${messageCreate.id}`)
        .getOne()

        const group= await this.groupChatReposity.createQueryBuilder('g')
        .innerJoin('g.members', 'member')
        .addSelect('member.user')

        //member
        .innerJoin('member.user', 'user')
        .addSelect(['user.id', 'user.fullname', 'user.avatar'])
        .where(`g.id = ${msg.group['id']}`)
        .getOne()

        const receivers= group.members.filter(
          (member)=> member.user['id'] !== msg.sender['id'])
          .map(m=>m.user['id'])
      return {
        msg,
        receivers
      }
    } catch (error) {
      return {
        status: -1,
        message: "falied " + error
      };

    }
  }

  async findByGroup(group_id: number): Promise<Message[]> {
    const messages = await this.messageReposity
      .createQueryBuilder('m')

      .leftJoin('m.group', 'g')
      .addSelect('g.id')

      //parent
      .leftJoin('m.parent', 'p')
      .addSelect(['p.id'])
      .leftJoin('p.sender', 'p_sender')
      .addSelect(['p_sender.id', 'p_sender.fullname', 'p_sender.avatar'])

      .leftJoin('m.sender', 'sender')
      .addSelect(['sender.id', 'sender.fullname', 'sender.avatar'])
      .leftJoin('m.reactions', 'reactions')
      .addSelect(['reactions.reaction', 'reactions.id', 'reactions.user'])

      .leftJoinAndSelect('m.reads', 'read')
      .leftJoin('read.user', 'user')
      .addSelect(['user.avatar', 'user.fullname', 'user.id'])

      .where({
        group: group_id
      })
      .orderBy('m.create_at', 'DESC')
      .getMany()

    return messages;
  }


  async update(id: string, updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.messageReposity.findOne({ where: { id: id } })

      await this.messageReposity.save({
        ...message,
        ...updateMessageDto
      })
      return {
        status: 1,
        message: "Update Success"
      };
    } catch (error) {
      return {
        status: 0,
        message: "Update Failed"
      };
    }
  }

  async remove(id: string) {
    try {
      await this.likeMessageReposity.delete({
        message: id
      })
      await this.messageReadReposity.delete({
        message: id
      })
      await this.messageReposity.delete({ id: id })
      return {
        status: 1,
        message: "Delete Success"
      };
    } catch (error) {
      return {
        status: 0,
        message: "Delete Failed"
      };
    }
  }
}
