import {TypeExtendedLikesInfo} from "./reaction.types";
import {ObjectId} from "mongodb";

export type TypePostView = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt:  string;
    extendedLikesInfo: TypeExtendedLikesInfo
}

export type TypePostInputForBlog = {
    title: string,
    shortDescription: string,
    content: string
}
export type TypePostInput = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type TypePostDB = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt:  Date;
}