import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryColumn()
    posts_id:number;

    @PrimaryColumn()
    user_id:number;

    @Column()
    content:string

    @CreateDateColumn()
    create_time:Date
}
