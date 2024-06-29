import { GroupChat } from "src/group-chat/entities/group-chat.entity";
import { LikeMessage } from "src/like-message/entities/like-message.entity";
import { MessageRead } from "src/message-read/entities/message-read.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>User,(user)=>user.id)
    sender:number | Message

    @ManyToOne(()=>GroupChat,(group)=>group.id)
    group:number | GroupChat

    @OneToMany(()=>MessageRead,(m)=>m.message)
    reads:MessageRead[]

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date

    @Column()
    state:number

    @Column()
    type:string

    @Column()
    message:string

    @ManyToOne(()=>Message,(msg)=>msg.id)
    parent:Message | null

    @OneToMany(()=>LikeMessage,(like)=>like.message)
    reactions:LikeMessage[]
}
