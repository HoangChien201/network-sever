import { Comment } from "src/comment/entities/comment.entity"
import { User } from "src/user/entities/user.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class LikeComment {
    @PrimaryColumn()
    @ManyToOne(()=>Comment,(comment)=>comment.id)
    comment:number

    @PrimaryColumn()
    @ManyToOne(()=>User,(user)=>user.id)
    user:number

    @Column()
    reaction:number

    @CreateDateColumn()
    create_at:Date
    
    @UpdateDateColumn()
    update_at:Date
}
