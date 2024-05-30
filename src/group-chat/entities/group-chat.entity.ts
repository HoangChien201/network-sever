import { GroupMember } from "src/group-member/entities/group-member.entity";
import { Message } from "src/message/entities/message.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupChat {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @OneToMany(()=>GroupMember,(g_member)=>g_member.group_id)
    members:GroupMember[]

    @OneToMany(()=>Message,(msg)=>msg.group_id)
    messages:Message[]
}
