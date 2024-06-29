import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "./socket.entity";
import { Repository } from "typeorm";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/message/entities/message.entity";
import { Friendship } from "src/friendship/entities/friendship.entity";

const STATUS_FRIENDED = 2
const STATUS_REQUEST_FRIENDED = 1
@WebSocketGateway({ cors: true })
export class SocketGateWay {
    constructor(
        @InjectRepository(GroupMember)
        private readonly groupMemberRepository: Repository<GroupMember>,
        @InjectRepository(Friendship)
        private readonly friendShipRepository: Repository<Friendship>
    ) { }
    @WebSocketServer()
    sever;

    @SubscribeMessage('message')
    async handleEvent(@MessageBody() messageSK: Message): Promise<void> {
        const memberOfGroup = await this.groupMemberRepository.find({ where: { group: typeof messageSK.group === 'number' ? messageSK.group : messageSK.group.id } })


        if (!memberOfGroup) return

        const memberOfGroupIDs = memberOfGroup.map(m => m.user).filter(id => id !== messageSK.sender)
        if (!memberOfGroupIDs) return

        memberOfGroupIDs.forEach((member) => {
            this.sever.emit(`message-${member}`, messageSK)
        })

    }

    @SubscribeMessage('notification')
    async notificationHandle(@MessageBody() noti: Notification): Promise<void> {
        const sender=noti.userInfo.sender
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
        const friendIds = friendOfUser.map((f)=>{
            if (f.user1 === sender) {
                return f.user2
              }
              else {
                
                return f.user1
              }
        })
        if(!friendIds) return

        friendIds.forEach((id)=>{
            this.sever.emit(`notification-${id}`, noti)
        })
        
    }
}
