import { Comment } from "src/comment/entities/comment.entity"
import { User } from "src/user/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"

@Entity()
export class LikeComment {
    @PrimaryColumn()
    @ManyToOne(()=>Comment,(comment)=>comment.id)
    comment_id:number

    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.id)
    user_id:number

    @Column()
    reaction:number
}
