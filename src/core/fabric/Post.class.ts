import {TypePostDB, TypePostInput} from "../../settings/types/post.types";

export class Post{
    constructor(private props:TypePostDB) {}
    static create(dto:TypePostInput & {blogName: string}) {
        const post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName:  dto.blogName,
            createdAt: new Date(),
        }
        return new Post(post)
    }
    toDB(){
        return this.props
    }
}