import { Posts } from "src/posts/entities/posts.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class LikePost {
    @PrimaryColumn()
    @ManyToOne(()=>Posts,(posts)=>posts.likes)
    posts:number

    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.likePosts)
    user:number

    @Column()
    reaction:number

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date

}
