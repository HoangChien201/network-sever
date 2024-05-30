import { GroupChat } from "src/group-chat/entities/group-chat.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>User,(user)=>user.id)
    sender:number

    @ManyToOne(()=>GroupChat,(group)=>group.id)
    group_id:number

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date

    @Column()
    state:number

    @Column()
    type:number

    @Column()
    message:string
}
