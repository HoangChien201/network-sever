import { GroupMember } from "src/group-member/entities/group-member.entity";
import { Message } from "src/message/entities/message.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupChat {
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    name:string

    @Column()
    type:string

    @Column({nullable:true})
    image:string

    @OneToMany(()=>GroupMember,(g_member)=>g_member.group)
    members:GroupMember[]

    @OneToMany(()=>Message,(msg)=>msg.group)
    messages:Message[]
}
