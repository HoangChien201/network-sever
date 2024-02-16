import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    content:string;

    @ManyToOne(type=>Event)
    event_id:Event;

    @Column()
    user:number
}
