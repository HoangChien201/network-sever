import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Like {
    @PrimaryColumn()
    posts_id:number

    @PrimaryColumn()
    user_id:number
}
