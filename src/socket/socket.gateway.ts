import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "./socket.entity";
import { Repository } from "typeorm";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/message/entities/message.entity";

@WebSocketGateway({ cors: true })
export class SocketGateWay {
    constructor(
        @InjectRepository(GroupMember)
        private readonly groupMemberRepository: Repository<GroupMember>
    ) { }
    @WebSocketServer()
    sever;

    @SubscribeMessage('message')
    async handleEvent(@MessageBody() messageSK: Message): Promise<void> {
        const memberOfGroup = await this.groupMemberRepository.find({ where: { group: typeof messageSK.group === 'number'? messageSK.group : messageSK.group.id} })
        
        
        if (!memberOfGroup) return
        
        const memberOfGroupIDs = memberOfGroup.map(m => m.user).filter(id=>id !== messageSK.sender)
        if (!memberOfGroupIDs) return

        memberOfGroupIDs.forEach((member) => {
            this.sever.emit(`message-${member}`, messageSK)
        })

    }

    @SubscribeMessage('notification')
    async notificationHandle(@MessageBody() noti: Notification): Promise<void> {
        console.log('notification', noti);
        this.sever.emit(`notification-${noti.userInfo.receiver}`, noti)
    }
}