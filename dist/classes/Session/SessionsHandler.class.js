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
exports.SessionsHandler = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const SessionsService_class_1 = require("./SessionsService.class");
const inversify_1 = require("inversify");
let SessionsHandler = class SessionsHandler {
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async findAllSessions(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        const sessionsList = await this.sessionsService.findAllSessions(userId);
        res.status(httpStatuses_1.httpStatus.Ok).send(sessionsList);
    }
    async closeAllSessionsBesidesCurrent(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        const deviceId = req.deviceId;
        if (deviceId === undefined || deviceId === null || deviceId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        await this.sessionsService.closeAllSessionsBesidesCurrent(userId, deviceId);
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async closeSpecificSessionByDeviceId(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        const deviceId = req.params.deviceId;
        const result = await this.sessionsService.closeSpecificSessionByDeviceId(userId, deviceId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
};
exports.SessionsHandler = SessionsHandler;
exports.SessionsHandler = SessionsHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(SessionsService_class_1.SessionsService)),
    __metadata("design:paramtypes", [SessionsService_class_1.SessionsService])
], SessionsHandler);
