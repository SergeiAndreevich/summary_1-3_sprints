"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHandler = void 0;
const UsersService_class_1 = require("./UsersService.class");
const QueryRepo_class_1 = require("../QueryRepo.class");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const pagination_helper_1 = require("../../core/helpers/pagination.helper");
const inversify_1 = require("inversify");
let UserHandler = class UserHandler {
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
};
exports.UserHandler = UserHandler;
exports.UserHandler = UserHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(UsersService_class_1.UsersService)),
    __param(1, (0, inversify_1.inject)(QueryRepo_class_1.QueryRepo)),
    __metadata("design:paramtypes", [UsersService_class_1.UsersService,
        QueryRepo_class_1.QueryRepo])
], UserHandler);
