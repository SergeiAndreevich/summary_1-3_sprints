"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
class Blog {
    constructor(props) {
        this.props = props;
    }
    static create(dto) {
        const blog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        };
        return new Blog(blog);
    }
    toDB() {
        return this.props;
    }
}
exports.Blog = Blog;
