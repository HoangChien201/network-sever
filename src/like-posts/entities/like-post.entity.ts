import { Posts } from "src/posts/entities/posts.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class LikePost {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @ManyToOne(()=>Posts,(posts)=>posts.likes)
    posts:number

    @Column()
    @ManyToOne(()=>User,(user)=>user.likePosts)
    user:number

    @Column()
    reaction:number

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date

}
