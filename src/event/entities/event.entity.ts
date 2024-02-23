import { Topic } from "src/topic/entities/topic.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    date_start:string;

    @Column()
    date_end:string;

    @Column({nullable:true})
    description:string;
    
    @Column()
    status:number;

    @Column()
    price_ticket:number;

    @Column()
    image:string;

    @ManyToOne(type => Topic,topic => topic.events)
    topic:number

    @Column()
    address:string

    @CreateDateColumn()
    create_at:Date
}
