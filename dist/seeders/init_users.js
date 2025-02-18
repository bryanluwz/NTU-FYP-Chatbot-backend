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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAdmin = void 0;
// seeders/initializeUsers.ts
const models_1 = require("../models");
const enums_1 = require("../typings/enums");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mockdata_1 = require("./mockdata");
const initializeUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the admin user already exists
        const existingAdmin = yield models_1.User.findOne({
            where: { role: enums_1.UserRoleEnum.Admin },
        });
        if (existingAdmin) {
            console.log("Admin user already exists. Skipping insertion.");
            return;
        }
        // Insert mock users
        mockdata_1.usersMockData.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
            yield models_1.User.create(Object.assign(Object.assign({}, user), { password: hashedPassword }));
        }));
        console.log("Admin user inserted successfully.");
    }
    catch (error) {
        console.error("Error inserting admin user:", error);
    }
});
const initializeAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // This is the default admin user when the database is empty
        const defaultAdmin = {
            username: "admin",
            email: "admin@admin.com",
            password: "admin",
            role: enums_1.UserRoleEnum.Admin,
        };
        const hashedPassword = yield bcrypt_1.default.hash(defaultAdmin.password, 10);
        yield models_1.User.create(Object.assign(Object.assign({}, defaultAdmin), { password: hashedPassword }));
        console.log("Default admin user inserted successfully.");
    }
    catch (error) {
        console.error("Error inserting default admin user:", error);
    }
});
exports.initializeAdmin = initializeAdmin;
exports.default = initializeUsers;
