import mongoose, { Schema, Document } from "mongoose";
mongoose.connect("mongodb+srv://Satish3:Satish3.0@cluster0.w4ugm0a.mongodb.net/Course_Selling_ts")

enum Irole {
    STUDENT = "student",
  ADMIN = "admin", 
}

 export interface Iuser extends Document {
    name: string;
    email: string;
    password: string;
    role: Irole;
    createdAt: Date;
    updatedAt: Date;
}

const Userschema : Schema<Iuser> = new Schema<Iuser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role:{
        type: String,
        enum: Object.values(Irole),
        default: Irole.STUDENT
    },
    createdAt : {type: Date, default: Date.now},
    updatedAt : {type: Date, default: Date.now}
},{
    timestamps : true
})


const usermodel = mongoose.model("User", Userschema);

export { usermodel };
