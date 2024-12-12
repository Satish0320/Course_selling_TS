"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "satish0123456789";
const isAdmin = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            message: "Authorization token is missing."
        });
        return;
    }
    const decode = jsonwebtoken_1.default.verify(authorization, JWT_SECRET);
    // console.log("Decoded token:", decode)
    if (!decode || decode.role !== "admin") {
        res.json({
            message: "Access denied. Admins only."
        });
        return;
    }
    req.userId = decode.userId;
    next();
};
exports.isAdmin = isAdmin;
const isUser = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            message: "Authorization token is missing."
        });
        return;
    }
    const decode = jsonwebtoken_1.default.verify(authorization, JWT_SECRET);
    // console.log("Decoded token:", decode)
    if (decode.role !== "student") {
        res.json({
            message: "Acces denied, Students only"
        });
        return;
    }
    req.userId = decode.userId;
    next();
};
exports.isUser = isUser;
