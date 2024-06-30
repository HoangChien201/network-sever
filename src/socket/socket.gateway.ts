import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "./socket.entity";
import { Not, Repository } from "typeorm";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/message/entities/message.entity";
import { Friendship } from "src/friendship/entities/friendship.entity";
import { MessageRead } from "src/message-read/entities/message-read.entity";
import { LikeMessage } from "src/like-message/entities/like-message.entity";
import { MessageReadService } from "src/message-read/message-read.service";
import { LikeMessageService } from "src/like-message/like-message.service";
import { Injectable, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";

const STATUS_FRIENDED = 2
const STATUS_REQUEST_FRIENDED = 1
const STATUS_SEEN = 2
const STATUS_SEND = 1



type MessageReadType = {
    group: number,
    user: number
}

@WebSocketGateway({ cors: true })
export class SocketGateWay {
    constructor(
        @InjectRepository(GroupMember)
        private readonly groupMemberRepository: Repository<GroupMember>,
        @InjectRepository(Friendship)
        private readonly friendShipRepository: Repository<Friendship>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(MessageRead)
        private readonly messageReadRepository: Repository<MessageRead>,
        private likeMessageService: LikeMessageService,


    ) { }


    @WebSocketServer()
    sever;

    //xử lý gửi tin nhắn
    @SubscribeMessage('message')
    async handleMessage(@MessageBody() messageSK: Message): Promise<void> {
        const memberOfGroup = await this.groupMemberRepository.find({ where: { group: typeof messageSK.group === 'number' ? messageSK.group : messageSK.group.id } })


        if (!memberOfGroup) return

        const memberOfGroupIDs = memberOfGroup.map(m => m.user).filter((id) => {
            const sender = typeof messageSK.sender === 'object' ? messageSK.sender.id : messageSK.sender

            return id !== sender
        }
        )
        if (!memberOfGroupIDs) return

        memberOfGroupIDs.forEach((member) => {
            this.sever.emit(`message-${member}`, messageSK)
        })

    }

    //xử lý đọc tin nhắn
    @SubscribeMessage('read-message')
    async handleReadMessage(@MessageBody() messageRead: MessageReadType): Promise<void> {

        const messages = await this.messageRepository
            .createQueryBuilder('m')
            .where({
                group: messageRead.group,
                state:STATUS_SEND
                
            })
            .andWhere(`not m.sender=${messageRead.user}`)
            .andWhere(`
            not m.id in (SELECT m.id FROM message m
            left join message_read mr on mr.message=m.id
            where m.groupId=${messageRead.group}
            and mr.user = ${messageRead.user}
            and not m.senderId = ${messageRead.user} and m.state = ${STATUS_SEND}
            )`)
            .getMany()

        if (!messages) return

        messages.forEach(async (m) => {

            const messageReadCreate = await this.messageReadRepository.save({
                message: m.id,
                user: messageRead.user
            })
            await this.sever.emit(`read-message-${m.id}`, messageReadCreate)
        })


    }

    //xử lý reaction tin nhắn
    @SubscribeMessage('reaction-message')
    @UseGuards(AuthGuard)
    async handleReactionMessage(@MessageBody() reaction: LikeMessage, @Req() req: Request): Promise<void> {
        const reactionCreate = await this.likeMessageService.create({
            message: reaction.message,
            reaction: reaction.reaction
        }, req)
        console.log('reaction', reactionCreate);

        await this.sever.emit(`reaction-message-${reaction.message}`, reactionCreate)

    }

    //xử lý thông báo
    @SubscribeMessage('notification')
    async notificationHandle(@MessageBody() noti: Notification): Promise<void> {
        const sender = noti.userInfo.sender
        if (!noti.userInfo.multiple) {

            this.sever.emit(`notification-${noti.userInfo.receiver}`, noti)
            return
        }

        // // lấy danh sách bạn bè của user   
        const friendOfUser = await this.friendShipRepository
            .createQueryBuilder('f')
            .where(
                {
                    user2: sender,
                    status: STATUS_FRIENDED
                }
            )
            .orWhere(
                {
                    user1: sender,
                    status: STATUS_FRIENDED
                }
            )
            .getMany()

        //lọc id bạn bè của user
        const friendIds = friendOfUser.map((f) => {
            if (f.user1 === sender) {
                return f.user2
            }
            else {

                return f.user1
            }
        })
        if (!friendIds) return

        friendIds.forEach((id) => {
            this.sever.emit(`notification-${id}`, noti)
        })

    }
}
