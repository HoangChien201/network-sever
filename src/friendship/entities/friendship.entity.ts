import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Friendship {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @ManyToOne(()=>User,(user)=>user.id)
    user1:number

    @Column()
    @ManyToOne(()=>User,(user)=>user.id)
    user2:number

    @PrimaryColumn()
    status:number
    
    @CreateDateColumn()
    create_at:Date
}
