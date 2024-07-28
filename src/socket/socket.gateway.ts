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
import { User } from "src/user/entities/user.entity";

const STATUS_FRIENDED = 2
const STATUS_REQUEST_FRIENDED = 1
const STATUS_SEEN = 2
const STATUS_SEND = 1

type QRLoginType = {
    user:User;
    QRDevice:string
}

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
        @InjectRepository(LikeMessage)
        private readonly likeMessageRepository: Repository<LikeMessage>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

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
            this.sever.emit(`list-group-${member}`, messageSK)
        })

    }

    //xử lý đọc tin nhắn
    @SubscribeMessage('read-message')
    async handleReadMessage(@MessageBody() messageRead: MessageReadType): Promise<void> {

        const messages = await this.messageRepository
            .createQueryBuilder('m')
            .where({
                group: messageRead.group,
                state: STATUS_SEND

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
    async handleReactionMessage(@MessageBody() data: LikeMessage): Promise<void> {
        console.log('data', data);
        const reaction: LikeMessage = data[0]
        const status = data[1]

        switch (status) {
            case 1: {
                //create
                const reactionCreate = await this.likeMessageRepository.save({
                    message: reaction.message,
                    reaction: reaction.reaction,
                    user: reaction.user
                })
                console.log('reaction', reactionCreate);

                await this.sever.emit(`reaction-message-${reaction.message}`, {
                    reaction:reaction,
                    status:status
                })
                return
            }
            case 2: {
                //update
                this.updateReaction(reaction,status)
                return
            }
            case 3: {
                //delete
                this.deleteReaction(reaction,status)
                return
            }
        }


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

     //xử lý quét QRLogin
     @SubscribeMessage('qr-login')
     async QRLogin(@MessageBody() bodyQRLogin: QRLoginType): Promise<void> {
        const {QRDevice,user}=bodyQRLogin;
        if(!bodyQRLogin.user) return

        this.sever.emit(`qr-login-${QRDevice}`,user)
     }

    private async updateReaction(reaction: LikeMessage,status:number) {
        const reactionQuery = await this.likeMessageRepository.findOne({
            where: {
                user: reaction.user,
                message: reaction.message
            }
        })

        const reactionUpdate = await this.likeMessageRepository.save({
            ...reactionQuery,
            reaction: reaction.reaction
        })

        if (!reactionUpdate) return

        await this.sever.emit(`reaction-message-${reactionUpdate.message}`, {
            reaction:reaction,
            status:status
        })

    }

    private async deleteReaction(reaction: LikeMessage,status:number) {
        try {
            await this.likeMessageRepository.delete({
                user:reaction.user,
                message:reaction.message
            })
            await this.sever.emit(`reaction-message-${reaction.message}`, {
                reaction:reaction,
                status:status
            })
        } catch (error) {

        }


    }
}
