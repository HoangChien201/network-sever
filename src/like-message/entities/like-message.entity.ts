import { Message } from "src/message/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class LikeMessage {
    @PrimaryColumn()
    @ManyToOne(()=>Message,(msg)=>msg.reactions)
    message:number;

    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.likeMessages)
    user:number;

    @Column()
    reaction:number;

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date
}
