import { GroupChat } from "src/group-chat/entities/group-chat.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class GroupMember {
    @PrimaryColumn()
    @ManyToOne(()=>GroupChat,(group)=>group.id)
    group:number

    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.id)
    user:number


}
