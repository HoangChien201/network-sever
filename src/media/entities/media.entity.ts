import { Posts } from "src/posts/entities/posts.entity"
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Posts,(posts)=>posts.id)
    posts_id:number

    @Column()
    type:string

    @Column()
    url:string
    
}
