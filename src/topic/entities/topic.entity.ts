import { Event } from "src/event/entities/event.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Topic {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @OneToMany(type => Event,event => event.topic)
    events:Event[]
}
