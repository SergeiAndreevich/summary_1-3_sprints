import {TypeBlogDB, TypeBlogFrontView} from "../../settings/types/blog.types";
import {ObjectId} from "mongodb";
import {WithMongoId} from "../../settings/database/db_settings";

export function mapBlogToFrontView (blog: WithMongoId<TypeBlogDB>): TypeBlogFrontView {
   return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership
    }
}