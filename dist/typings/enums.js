"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleEnum = exports.ChatUserTypeEnum = void 0;
var ChatUserTypeEnum;
(function (ChatUserTypeEnum) {
    ChatUserTypeEnum["System"] = "system";
    ChatUserTypeEnum["User"] = "user";
    ChatUserTypeEnum["AI"] = "ai";
})(ChatUserTypeEnum || (exports.ChatUserTypeEnum = ChatUserTypeEnum = {}));
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["Admin"] = "admin";
    UserRoleEnum["Educator"] = "educator";
    UserRoleEnum["User"] = "user";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
