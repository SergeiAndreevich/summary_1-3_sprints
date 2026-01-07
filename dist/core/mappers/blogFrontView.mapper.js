"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBlogToFrontView = mapBlogToFrontView;
function mapBlogToFrontView(blog) {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership
    };
}
