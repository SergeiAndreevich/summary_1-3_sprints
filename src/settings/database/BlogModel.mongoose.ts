import mongoose from "mongoose";
import {TypeBlogDB} from "../types/blog.types";

const BlogSchema = new mongoose.Schema<TypeBlogDB>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    isMembership: {type: Boolean, default: false}
    },
    {
        versionKey: false
    }
)

export const BlogModel = mongoose.model('Blog', BlogSchema);