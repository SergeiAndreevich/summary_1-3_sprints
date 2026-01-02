import {model, Schema} from "mongoose";
import {TypeCommentDB} from "../types/comment.types";


//добавляем схему
const CommentSchema = new Schema<TypeCommentDB>(
    {
        postId: { type: String, required: true },  //должно быть поле postId, строчное, обязательное
        content: { type: String, required: true , minlength: 20, maxLength: 300, trim: true},  //должно быть поле content, строчное, обязательное, min 20, max 300
        commentatorInfo: {                                      //должно быть поле commentatorInfo
            userId: { type: String, required: true },           //должно быть поле userId, строчное, обязательное
            userLogin: { type: String, required: true },        //должно быть поле userLogin, строчное, обязательное
        createdAt: { type: Date, default: Date.now }
        },
    },
    { versionKey: false }
);

export const CommentModel = model<TypeCommentDB>('Comment', CommentSchema);
