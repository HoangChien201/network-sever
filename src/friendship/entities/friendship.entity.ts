import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Friendship {
    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.id)
    user_id1:number

    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.id)
    user_id2:number

    
}
