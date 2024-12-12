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
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const Db_1 = require("./Db");
const middleware_1 = require("./middleware");
const AdminRouter = express_1.default.Router();
exports.AdminRouter = AdminRouter;
AdminRouter.post("/create_Course", middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requirebody = zod_1.default.object({
        title: zod_1.default.string(),
        description: zod_1.default.string(),
        price: zod_1.default.number(),
        admin_id: zod_1.default.string()
    });
    const validaterequirebody = requirebody.safeParse(req.body);
    if (!validaterequirebody.success) {
        res.json({
            message: "Invalid Inputs",
            Error: validaterequirebody.error
        });
        return;
    }
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const admin_id = req.userId;
    const course = yield Db_1.coursemodel.create({
        title: title,
        description: description,
        price: price,
        admin_id: admin_id
    });
    res.json({
        message: "course created",
        courseId: course._id
    });
}));
