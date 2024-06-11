import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "./socket.entity";

@WebSocketGateway({cors:true})
export class SocketGateWay {
    @WebSocketServer()
    sever;

    @SubscribeMessage('message')
    async handleEvent(@MessageBody() data: any): Promise<void> {
        this.sever.emit(`message-${data.user_id_receice}`,data)
    }

    @SubscribeMessage('notification')
    async notificationHandle(@MessageBody() data: Notification): Promise<void> {
        console.log('notification',data);
        
        // this.sever.emit(`notification-${data.to}`,data)
    }
}