"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(props) {
        this.props = props;
    }
    static create(dto) {
        const post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: dto.blogName,
            createdAt: new Date(),
        };
        return new Post(post);
    }
    toDB() {
        return this.props;
    }
}
exports.Post = Post;
