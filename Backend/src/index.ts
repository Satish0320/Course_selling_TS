import express from "express";
import mongoose from "mongoose";


const app = express();
app.use(express.json());

import { UserRouter } from "./user_routes";
import { AdminRouter } from "./admin_routes";


app.use("/user", UserRouter);
app.use("/admin", AdminRouter)

async function connect () {
    await mongoose.connect("mongodb+srv://Satish3:Satish3.0@cluster0.w4ugm0a.mongodb.net/Course_Selling_ts");
    app.listen(4000);
    console.log("Connected Sucessfully");
}


connect();