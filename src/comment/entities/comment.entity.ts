import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    comment_id:number

    @Column()
    posts_id:number;

    @Column()
    user:number;

    @Column()
    content:string

    @CreateDateColumn()
    create_time:Date
}
