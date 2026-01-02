import {Types} from "mongoose";

export type TypeBlogInput = {
    name: string,
    description: string,
    websiteUrl: string
}

export type TypeBlogFrontView = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type TypeBlogDB = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}