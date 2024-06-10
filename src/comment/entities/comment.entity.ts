import { LikeComment } from "src/like-comment/entities/like-comment.entity";
import { Posts } from "src/posts/entities/posts.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Posts,(posts)=>posts.id)
    posts:number;

    @ManyToOne(()=>User,(user)=>user.id)
    user:number ;

    @ManyToOne(()=>Comment,(comment)=>comment.id)
    parent:number | Comment;

    @OneToMany(()=>LikeComment,(likeComment)=>likeComment.comment)
    likeComment:number | LikeComment[];

    @Column()
    content:string

    @Column({nullable:true})
    image:string

    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date
}
