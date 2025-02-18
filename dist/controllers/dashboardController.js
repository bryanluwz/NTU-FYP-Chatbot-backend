"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserList = void 0;
const models_1 = require("../models");
// Admin Dashboard (getUserList, updateUser, deleteUser, ...other actions)
const getUserList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    // Check if user is an admin
    const user = yield models_1.User.findByPk(userId);
    if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
    }
    try {
        const users = yield models_1.User.findAll();
        const usersWithoutPassword = users.map((user) => {
            const _a = user.toJSON(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            return userWithoutPassword;
        });
        const formattedUsers = usersWithoutPassword.map((user) => {
            return Object.assign(Object.assign({}, user), { avatar: `/avatars/${user.avatar}` });
        });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                users: formattedUsers,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chats" });
    }
});
exports.getUserList = getUserList;
