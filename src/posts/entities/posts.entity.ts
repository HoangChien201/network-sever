import { Comment } from "src/comment/entities/comment.entity";
import { LikePost } from "src/like-posts/entities/like-post.entity";
import { Media } from "src/media/entities/media.entity";
import { TagPost } from "src/tag-posts/entities/tag-post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    //relation user
    @ManyToOne(() => User, (user) => user.posts)
    creater: User | number

    //relation share
    @OneToMany(() => Posts, (posts) => posts.share_id)
    share_id: Posts[]

    //relation like_post
    @OneToMany(() => LikePost, (likePosts) => likePosts.posts_id)
    likes: LikePost[]

    //relation comment
    @OneToMany(() => Comment, (commnet) => commnet.posts_id)
    comment: Comment[]

    //relation media
    @OneToMany(() => Media, (media) => media.posts_id)
    media: Media[]

    //relation tag
    @OneToMany(() => TagPost, (tag) => tag.posts_id)
    tags: TagPost[]

    @CreateDateColumn({ nullable: true })
    create_at: Date

    @UpdateDateColumn({ nullable: true })
    update_at: Date

    @Column()
    permission: number
}
