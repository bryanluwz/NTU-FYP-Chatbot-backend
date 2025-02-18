"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPResponseCode = exports.HTTPMethod = void 0;
var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["GET"] = "GET";
    HTTPMethod["POST"] = "POST";
    HTTPMethod["PUT"] = "PUT";
    HTTPMethod["DELETE"] = "DELETE";
})(HTTPMethod || (exports.HTTPMethod = HTTPMethod = {}));
var HTTPResponseCode;
(function (HTTPResponseCode) {
    HTTPResponseCode[HTTPResponseCode["OK"] = 200] = "OK";
    HTTPResponseCode[HTTPResponseCode["CREATED"] = 201] = "CREATED";
    HTTPResponseCode[HTTPResponseCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    HTTPResponseCode[HTTPResponseCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTPResponseCode[HTTPResponseCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTPResponseCode[HTTPResponseCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTPResponseCode[HTTPResponseCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTPResponseCode[HTTPResponseCode["CONFLICT"] = 409] = "CONFLICT";
    HTTPResponseCode[HTTPResponseCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HTTPResponseCode || (exports.HTTPResponseCode = HTTPResponseCode = {}));
