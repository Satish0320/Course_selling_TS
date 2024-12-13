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
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "satish0123456789";
const Db_1 = require("./Db");
const middleware_1 = require("./middleware");
const UserRouter = express_1.default.Router();
exports.UserRouter = UserRouter;
UserRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requirebody = zod_1.default.object({
        name: zod_1.default.string(),
        email: zod_1.default.string().email(),
        password: zod_1.default.string(),
        role: zod_1.default.string().optional()
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
    const RandomMoney = Math.floor(Math.random() * 100000);
    const User = yield Db_1.usermodel.create({
        name: name,
        email: email,
        password: hashpassword,
        role: role || "student",
        wallet: RandomMoney
    });
    res.json({
        message: "User created",
        User
    });
}));
UserRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
UserRouter.get("/courses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Db_1.coursemodel.find();
    const CourseDetails = courses.map(course => ({
        Title: course.title,
        Description: course.description,
        Price: course.price,
    }));
    res.json({
        CourseDetails
    });
}));
UserRouter.post("/Enrolled", middleware_1.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user_id = req.userId;
    const course_id = req.body.course_id;
    const payment_id = req.body.payment_id;
    // console.log(user_id);
    const finduserId = yield Db_1.usermodel.findOne({
        _id: user_id
    });
    // console.log(finduserId);
    if (!finduserId) {
        res.json({
            message: "Invalid user"
        });
        return;
    }
    const findcourseId = yield Db_1.coursemodel.findOne({
        _id: course_id
    });
    if (!findcourseId) {
        res.json({
            message: "Invalid Course Id"
        });
        return;
    }
    const findpaymentId = yield Db_1.paymentmodel.findOne({
        _id: payment_id
    });
    if (!findpaymentId) {
        res.json({
            message: "Invalid payment Id"
        });
        return;
    }
    const Purchased_course = yield Db_1.enrollmentmodel.create({
        user_id: user_id,
        course_id: course_id,
        payment_id: payment_id
    });
    const Purchased_Details = yield Db_1.enrollmentmodel
        .findById(Purchased_course._id)
        .populate("user_id", "name")
        .populate("course_id", "title")
        .populate("payment_id");
    if (!Purchased_Details) {
        res.status(404).json({ message: "Enrollment details not found" });
        return;
    }
    res.json({
        enrollment_id: Purchased_Details._id,
        user_name: (_a = Purchased_Details.user_id) === null || _a === void 0 ? void 0 : _a.name,
        course_title: (_b = Purchased_Details.course_id) === null || _b === void 0 ? void 0 : _b.title,
        payment_id: (_c = Purchased_Details.payment_id) === null || _c === void 0 ? void 0 : _c._id,
    });
}));
UserRouter.post("/buy_course/payment", middleware_1.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.userId;
    const course_id = req.body.course_id;
    const amount = req.body.amount;
    const finduser = yield Db_1.usermodel.findOne({
        _id: user_id
    });
    if (!finduser) {
        res.json({
            message: "Invaild user Id"
        });
        return;
    }
    const findcourse = yield Db_1.coursemodel.findOne({
        _id: course_id
    });
    if (!findcourse) {
        res.json({
            message: "Invalid course Id"
        });
        return;
    }
    if (findcourse < amount) {
        res.json({
            message: "Insufficient funds"
        });
        return;
    }
    finduser.wallet -= amount;
    yield finduser.save();
    const paymentDetails = yield Db_1.paymentmodel.create({
        user_id: user_id,
        course_id: course_id,
        amount: amount
    });
    const Payment_Details = yield Db_1.paymentmodel
        .findById(paymentDetails._id)
        .populate("course_id", "title")
        .populate("user_id", "name");
    if (!Payment_Details) {
        res.status(404).json({ message: "Payment details not found" });
        return;
    }
    res.json({
        payment_id: Payment_Details._id,
        course_name: Payment_Details.course_id.title,
        user_name: Payment_Details.user_id.name,
        amount: paymentDetails.amount,
        remaining_Balance: finduser.wallet
    });
}));
