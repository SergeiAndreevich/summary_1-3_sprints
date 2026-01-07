"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHandler = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const pagination_helper_1 = require("../../core/helpers/pagination.helper");
class UserHandler {
    constructor(usersService, queryRepo) {
        this.usersService = usersService;
        this.queryRepo = queryRepo;
    }
    async createUser(req, res) {
        const userInput = req.body;
        const result = await this.usersService.createUser(userInput);
        if (result.status !== httpStatuses_1.httpStatus.Created) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Created).send(result.data);
    }
    async getAllUsers(req, res) {
        const query = req.query;
        const paginationFilter = (0, pagination_helper_1.paginationHelper)(query);
        const usersList = await this.queryRepo.findUsersByFilter(paginationFilter);
        res.status(httpStatuses_1.httpStatus.Ok).send(usersList);
    }
    async deleteSpecificUserById(req, res) {
        const userId = req.params.id;
        const result = await this.usersService.deleteSpecificUser(userId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
}
exports.UserHandler = UserHandler;
