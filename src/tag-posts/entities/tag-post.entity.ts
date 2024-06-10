import { Posts } from "src/posts/entities/posts.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class TagPost {
    @ManyToOne(()=>Posts,(posts)=>posts.id)
    @PrimaryColumn()
    posts_id:number

    @ManyToOne(()=>User,(user)=>user.id)
    @PrimaryColumn()
    user:number

}
