"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserToView = mapUserToView;
function mapUserToView(user) {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.createdAt.toISOString()
    };
}
