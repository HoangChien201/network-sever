import { LikeComment } from "src/like-comment/entities/like-comment.entity";
import { Posts } from "src/posts/entities/posts.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Posts,(posts)=>posts.id)
    posts_id:number | Posts;

    @ManyToOne(()=>User,(user)=>user.id)
    user_id:number | User;

    @ManyToOne(()=>Comment,(comment)=>comment.id)
    parent_id:number | Comment;

    @OneToMany(()=>LikeComment,(likeComment)=>likeComment.comment_id)
    likeComment:number | LikeComment[];

    @Column()
    content:string

    @Column({nullable:true})
    image:string

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    udpate_at:Date
}
