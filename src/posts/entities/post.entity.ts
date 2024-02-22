import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    content:string;

    @Column({nullable:true})
    image:string;

    @ManyToOne(type=>Event)
    event_id:Event;

    @Column()
    user:number

    @Column()
    status:number

    @CreateDateColumn()
    create_time:Date
}
