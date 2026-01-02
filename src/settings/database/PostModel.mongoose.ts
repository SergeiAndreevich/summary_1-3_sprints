import mongoose from "mongoose";
import {TypePostDB} from "../types/post.types";

const PostSchema = new mongoose.Schema<TypePostDB>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt:  {type: Date, default: Date.now},
},{
    versionKey: false,
    }
)

export const PostModel = mongoose.model("Post", PostSchema);