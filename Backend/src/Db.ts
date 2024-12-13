import mongoose, { Schema, Document } from "mongoose";
import { string } from "zod";

enum Irole {
    STUDENT = "student",
    ADMIN = "admin",
}

export interface Iuser extends Document {
    name: string;
    email: string;
    password: string;
    role: Irole;
    wallet: number;
    createdAt: Date;
    updatedAt: Date;
}

const Userschema: Schema<Iuser> = new Schema<Iuser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(Irole),
        default: Irole.STUDENT
    },
    wallet: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
})


export interface Icourse extends Document {
    title: string;
    description: string;
    price: number;
    admin_id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const courseschema: Schema<Icourse> = new Schema<Icourse> ({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    admin_id: {
        type : Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {type:Date, default:Date.now},
    updatedAt: {type:Date, default:Date.now}
},{
    timestamps: true
}) 


export interface Ienrolment extends Document {
    user_id: mongoose.Types.ObjectId;
    course_id: mongoose.Types.ObjectId;
    payment_id: mongoose.Types.ObjectId,
    enrollmentdate: Date
}

const enrollmentschema: Schema<Ienrolment> = new Schema<Ienrolment> ({
    user_id: {type: Schema.Types.ObjectId, ref:"User", required: true},
    course_id: {type: Schema.Types.ObjectId,ref: "Course",  required: true},
    payment_id: {type: Schema.Types.ObjectId, ref: "Payment", required: true},
    enrollmentdate: {type: Date, default:Date.now}
},{
    timestamps: true
}) 

export interface Ipayment extends Document {
    user_id: mongoose.Types.ObjectId,
    course_id: mongoose.Types.ObjectId,
    amount: number,
    paymentDate: Date
}

const paymentschema: Schema<Ipayment> = new Schema<Ipayment> ({
    user_id: {type: Schema.Types.ObjectId, ref: "User",  required: true},
    course_id: {type: Schema.Types.ObjectId, ref: "Course",  required: true},
    amount: {type: Number, required: true},
    paymentDate: {type: Date, default:Date.now}
},{
    timestamps: true
})

const usermodel = mongoose.model("User", Userschema);
const coursemodel = mongoose.model("Course", courseschema)
const enrollmentmodel = mongoose.model("Enrollment", enrollmentschema)
const paymentmodel = mongoose.model("Payment", paymentschema)

export { usermodel, coursemodel, enrollmentmodel, paymentmodel};
