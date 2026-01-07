"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
class Comment {
    constructor(props) {
        this.props = props;
    }
    static create(postId, dto, user) {
        const props = {
            postId,
            content: dto.content,
            commentatorInfo: {
                userId: user.userId,
                userLogin: user.userLogin
            },
            createdAt: new Date()
        };
        return new Comment(props);
    }
    toDB() {
        return this.props;
    }
}
exports.Comment = Comment;
