import { Posts } from "src/posts/entities/posts.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class LikePost {
    @PrimaryColumn()
    @ManyToOne(()=>Posts,(posts)=>posts.id)
    posts_id:number

    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.id)
    user_id:number

    @Column()
    reaction:number

}
