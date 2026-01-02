import {TypeCommentatorInfo, TypeCommentDB, TypeCommentInput} from "../../settings/types/comment.types";

export class Comment {
    constructor(private props: TypeCommentDB){}
    static create(postId:string,dto: TypeCommentInput, user:TypeCommentatorInfo){
        const props = {
            postId,
            content: dto.content,
            commentatorInfo: {
                userId: user.userId,
                userLogin: user.userLogin
            },
            createdAt: new Date()
        }
        return new Comment(props)
    }
    toDB(){
        return this.props
    }
}