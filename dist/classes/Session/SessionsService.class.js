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
exports.SessionsService = void 0;
const SessionsRepo_class_1 = require("./SessionsRepo.class");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const QueryRepo_class_1 = require("../QueryRepo.class");
const inversify_1 = require("inversify");
let SessionsService = class SessionsService {
    constructor(queryRepo, sessionsRepo) {
        this.queryRepo = queryRepo;
        this.sessionsRepo = sessionsRepo;
    }
    async findAllSessions(userId) {
        const result = await this.sessionsRepo.findAllSessions(userId);
        return result;
    }
    async closeAllSessionsBesidesCurrent(userId, deviceId) {
        await this.sessionsRepo.closeAllSessionsBesidesCurrent(userId, deviceId);
        return;
    }
    async closeSpecificSessionByDeviceId(userId, deviceId) {
        const session = await this.queryRepo.findSessionByDeviceId(deviceId);
        if (!session) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'database', message: 'notFound' } };
        }
        const result = await this.sessionsRepo.closeSpecificSession(userId, deviceId);
        if (!result) {
            return { data: null, status: httpStatuses_1.httpStatus.Forbidden, error: { field: 'database', message: 'not your device' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(QueryRepo_class_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(SessionsRepo_class_1.SessionsRepo)),
    __metadata("design:paramtypes", [QueryRepo_class_1.QueryRepo,
        SessionsRepo_class_1.SessionsRepo])
], SessionsService);
