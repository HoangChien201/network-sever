import { Message } from "src/message/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class LikeMessage {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @ManyToOne(()=>Message,(msg)=>msg.reactions)
    message:number;

    @Column()
    @ManyToOne(()=>User,(user)=>user.likeMessages)
    user:number;

    @Column()
    reaction:number;

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date
}
