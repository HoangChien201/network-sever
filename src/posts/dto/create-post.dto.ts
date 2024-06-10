import { Media } from "src/media/entities/media.entity";
import { TagPost } from "src/tag-posts/entities/tag-post.entity";

export class CreatePostDto {
    id:number | null;
    content:string;
    creater:number;
    permission:number;
    tags:Array<TagPost> | null;
    medias:Array<Media> | null;
    type:number
}
