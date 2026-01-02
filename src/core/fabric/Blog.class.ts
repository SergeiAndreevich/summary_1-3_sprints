import {TypeBlogDB, TypeBlogInput} from "../../settings/types/blog.types";

export class Blog {
    constructor(private props:TypeBlogDB){}
    static create(dto:TypeBlogInput){
        const blog:TypeBlogDB = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        return new Blog(blog)
    }
    toDB():TypeBlogDB{
        return this.props
    }
}