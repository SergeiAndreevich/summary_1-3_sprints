import {UserModel} from "../settings/database/UserModel.mongoose";
import {TypeDBUser, TypeUserFrontView} from "../settings/types/user.types";
import {mapUserToView} from "../core/mappers/userViewModel.mapper";
import {IPAginationAndSorting} from "../settings/types/pagination.types";
import {ObjectId} from "mongodb";
import {WithMongoId} from "../settings/database/db_settings";
import {BlogModel} from "../settings/database/BlogModel.mongoose";
import {mapBlogToFrontView} from "../core/mappers/blogFrontView.mapper";
import {TypeBlogDB} from "../settings/types/blog.types";
import {PostModel} from "../settings/database/PostModel.mongoose";
import {TypePostDB, TypePostView} from "../settings/types/post.types";
import {likesCounterHelper} from "../core/helpers/likeCounter.helper";
import {EntitiesForReaction, ReactionType} from "../settings/types/reaction.types";
import {SessionModel} from "../settings/database/SessionModel.mongoose";
import {TypeSession} from "../settings/types/session.types";
import {mapSessionToView} from "../core/mappers/mapSessionToView.mapper";
import {injectable} from "inversify";

@injectable()
export class QueryRepo {
    async findUserByLoginOrEmail(login:string, email: string): Promise<TypeUserFrontView | null> {
    const user = await UserModel.findOne(
        {$or: [
                { 'accountData.login': login },
                { 'accountData.email': email }
            ]}).lean<TypeDBUser & {_id: ObjectId}>();
    if (!user) {
        return null
    }
    return mapUserToView(user)
    }
    async findUsersByFilter(dto:IPAginationAndSorting){
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchLoginTerm,
            searchEmailTerm
        } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];

        if (searchNameTerm) {
            andFilters.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }

        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }

        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await UserModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean< WithMongoId<TypeDBUser>[]>();
        const totalCount = await UserModel.countDocuments(filter);
        const usersToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => mapUserToView(item))
        }
        return usersToView
    }
    async findUserById(userId:string){
        const user = await UserModel.findById(userId).lean<WithMongoId<TypeDBUser>>()
        if(!user){
            return null
        }
        return mapUserToView(user)
    }

    async findSpecificBlog(blogId: string){
        const blog = await BlogModel.findById(blogId).lean<WithMongoId<TypeBlogDB>>();
        if (!blog) {
            return null;
        }
        return mapBlogToFrontView(blog);
    }
    async findPostsForSpecificBlog(blogId: string, dto:IPAginationAndSorting, userId?:string){
        const blog = await BlogModel.findById(blogId).lean<WithMongoId<TypeBlogDB>>();
        if(!blog) {
            return null;
        }
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchLoginTerm,
            searchEmailTerm
        } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];
        andFilters.push({blogId: blogId})

        if (searchNameTerm) {
            andFilters.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }

        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await PostModel.find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean< WithMongoId<TypePostDB>[]>();
        const totalCount = await PostModel.countDocuments(filter);

        //теперь пошло новенькое: агрегация лайков
        const postIds = items.map(p => p._id.toString());
        //ищем все записи в коллекции реакций по всем пост-id для нашего блога
        const {reactionMap, myStatusMap} = await likesCounterHelper.getLikesForEntity(EntitiesForReaction.post,postIds,userId)

        const enrichedData:TypePostView[] = items.map(p=>({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt.toISOString(),
            extendedLikesInfo:{
                likesCount: reactionMap[p._id.toString()].likes ?? 0,
                dislikesCount: reactionMap[p._id.toString()].dislikes ?? 0,
                myStatus: userId ?  myStatusMap[p._id.toString()] ?? ReactionType.none : ReactionType.none,
                newestLikes: reactionMap[p._id.toString()].newestLikes ?? []
            }
        }));


        const postsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: enrichedData
        }
        return postsToView;
    }
    async findBlogsByFilter(dto:IPAginationAndSorting){
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchLoginTerm,
            searchEmailTerm
        } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];

        if (searchNameTerm) {
            andFilters.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }

        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }

        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean< WithMongoId<TypeBlogDB>[]>();
        const totalCount = await BlogModel.countDocuments(filter);
        const blogsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => mapBlogToFrontView(item))
        }
        return blogsToView
    }

    async findSessionByDeviceId(deviceId: string){
        const session = await SessionModel.findOne({deviceId: deviceId}).lean<WithMongoId<TypeSession>>()
        if(!session){
            return null
        }
        return mapSessionToView(session)
    }
}