import { Message } from "src/message/entities/message.entity";

export class Notification {
    body: string;
    title: string;
    category: string;
    userInfo: { 
        sender:number,
        receiver:number
    };
    fireDate: Date;
}

export class MessageSocket {
    group:number;
    message:Message
}