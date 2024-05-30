import { Comment } from "src/comment/entities/comment.entity";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { LikeComment } from "src/like-comment/entities/like-comment.entity";
import { LikePost } from "src/like-posts/entities/like-post.entity";
import { Message } from "src/message/entities/message.entity";
import { Posts } from "src/posts/entities/posts.entity";
import { TagPost } from "src/tag-posts/entities/tag-post.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;
    
    @Column()
    password:string;

    @Column({nullable:true})
    fullname:string;

    @Column({nullable:true})
    avatar:string;

    @Column({nullable:true})
    phone:string;

    @Column()
    role:number;

    @Column({nullable:true})
    gender:string;

    @Column({nullable:true})
    address:string;

    //relation posts
    @OneToMany(()=>Posts,(posts)=>posts.id)
    posts:Posts[]

    //relation comment
    @OneToMany(()=>Comment,(comment)=>comment.id)
    comments:Comment[]

    //relation like_post
    @OneToMany(()=>LikePost,(likePost)=>likePost.user_id)
    likePosts:LikePost[]

    //relation like_comment
    @OneToMany(()=>LikeComment,(likeComment)=>likeComment.user_id)
    likeComment:LikeComment[]

    //relation tag
    @OneToMany(() => TagPost, (tag) => tag.posts_id)
    tags: TagPost[]

    //relation GroupMember
    @OneToMany(() => GroupMember, (g_member) => g_member.user_id)
    groupMember: GroupMember[]


    //relation message
    @OneToMany(() => Message, (msg) => msg.sender)
    msg: Message[]
}
