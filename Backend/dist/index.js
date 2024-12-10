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
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "satish0123456789";
const Db_1 = require("./Db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/user/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requirebody = zod_1.default.object({
        name: zod_1.default.string(),
        email: zod_1.default.string().email(),
        password: zod_1.default.string(),
        role: zod_1.default.string()
    });
    const validaterequirebosy = requirebody.safeParse(req.body);
    if (!validaterequirebosy.success) {
        res.json({
            message: "invalid inputs",
            error: validaterequirebosy.error
        });
        return;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const hashpassword = yield bcrypt_1.default.hash(password, 5);
    const newUser = yield Db_1.usermodel.create({
        name: name,
        email: email,
        password: hashpassword,
        role: role || "student"
    });
    res.json({
        message: "User created",
        newUser
    });
}));
app.post("/user/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const finduser = yield Db_1.usermodel.findOne({
        email: email
    });
    if (!finduser) {
        res.json({
            message: "Invalid email or password"
        });
        return;
    }
    const hashpassword = yield bcrypt_1.default.compare(password, finduser.password);
    const payload = { userId: finduser._id, role: finduser.role };
    if (hashpassword) {
        const Token = jsonwebtoken_1.default.sign(payload, JWT_SECRET);
        res.json({
            Token,
            message: "Welcome user",
        });
    }
}));
app.listen(4000);
