import { Message } from "src/message/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageRead {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    @ManyToOne(()=>User,(u)=>u.id)
    user:number;

    @Column()
    @ManyToOne(()=>Message,(m)=>m.id)
    message:string;

    @CreateDateColumn()
    read_at:Date;
}
