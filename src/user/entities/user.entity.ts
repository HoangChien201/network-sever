import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({nullable:true})
    role:number;

    @Column({nullable:true})
    gender:string;

    @Column({nullable:true})
    address:string;
}
