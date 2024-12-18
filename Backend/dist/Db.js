"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentmodel = exports.enrollmentmodel = exports.coursemodel = exports.usermodel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var Irole;
(function (Irole) {
    Irole["STUDENT"] = "student";
    Irole["ADMIN"] = "admin";
})(Irole || (Irole = {}));
const Userschema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(Irole),
        default: Irole.STUDENT
    },
    wallet: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
const courseschema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    admin_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
const enrollmentschema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    payment_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment", required: true },
    enrollmentdate: { type: Date, default: Date.now }
}, {
    timestamps: true
});
const paymentschema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});
const usermodel = mongoose_1.default.model("User", Userschema);
exports.usermodel = usermodel;
const coursemodel = mongoose_1.default.model("Course", courseschema);
exports.coursemodel = coursemodel;
const enrollmentmodel = mongoose_1.default.model("Enrollment", enrollmentschema);
exports.enrollmentmodel = enrollmentmodel;
const paymentmodel = mongoose_1.default.model("Payment", paymentschema);
exports.paymentmodel = paymentmodel;
