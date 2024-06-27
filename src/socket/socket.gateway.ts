import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageSocket, Notification } from "./socket.entity";
import { Repository } from "typeorm";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { InjectRepository } from "@nestjs/typeorm";

@WebSocketGateway({ cors: true })
export class SocketGateWay {
    constructor(
        @InjectRepository(GroupMember)
        private readonly groupMemberRepository: Repository<GroupMember>
    ) { }
    @WebSocketServer()
    sever;

    @SubscribeMessage('message')
    async handleEvent(@MessageBody() messageSK: MessageSocket): Promise<void> {
        const memberOfGroup = await this.groupMemberRepository.find({ where: { group: messageSK.group } })

        if (!memberOfGroup) return

        const memberOfGroupIDs = memberOfGroup.map(m => m.group).filter(id=>id !== messageSK.message.sender)
        if (!memberOfGroupIDs) return

        memberOfGroupIDs.forEach((member) => {
            this.sever.emit(`message-${member}`, messageSK.message)
        })

    }

    @SubscribeMessage('notification')
    async notificationHandle(@MessageBody() noti: Notification): Promise<void> {
        console.log('notification', noti);
        this.sever.emit(`notification-${noti.userInfo.receiver}`, noti)
    }
}