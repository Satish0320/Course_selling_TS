import express from "express";
import z, { string } from "zod";
import { usermodel, coursemodel } from "./Db"
import {  Icourse } from "./Db"
import { isAdmin } from "./middleware";

const AdminRouter = express.Router();


AdminRouter.post("/create_Course", isAdmin, async  (req, res)=>{

    const requirebody = z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        admin_id: z.string()
    })
    const validaterequirebody = requirebody.safeParse(req.body);

    if (!validaterequirebody.success) {
         res.json({
            message: "Invalid Inputs",
            Error: validaterequirebody.error
        })  
        return
    }

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const admin_id = req.userId;

    const course: Icourse =await coursemodel.create({
        title: title,
        description: description,
        price: price,
        admin_id: admin_id
    })

    res.json({
        message: "course created",
        courseId: course._id
    })

})





export { AdminRouter}