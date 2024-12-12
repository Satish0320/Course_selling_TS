import express from "express";
import z, { string } from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const JWT_SECRET = "satish0123456789"
import { coursemodel, enrollmentmodel, Ienrolment, usermodel } from "./Db"
import { Iuser } from "./Db"
import { isAdmin, isUser } from "./middleware";

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {

    const requirebody = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.string().optional()
    })
    const validaterequirebosy = requirebody.safeParse(req.body);

    if (!validaterequirebosy.success) {
        res.json({
            message: "invalid inputs",
            error: validaterequirebosy.error
        })
        return;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role

    const hashpassword = await bcrypt.hash(password, 5);

    const User: Iuser = await usermodel.create({
        name: name,
        email: email,
        password: hashpassword,
        role: role || "student"
    })

    res.json({
        message: "User created",
        User
    })

})

UserRouter.post("/signin", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password

    const finduser = await usermodel.findOne({
        email: email
    })

    if (!finduser) {
        res.json({
            message: "Invalid email or password"
        })
        return;
    }

    const hashpassword = await bcrypt.compare(password, finduser.password)
    const payload = { userId: finduser._id, role: finduser.role }
    if (hashpassword) {
        const Token = jwt.sign(
            payload, JWT_SECRET
        )
        res.json({
            Token,
            message: "Welcome user",

        })
    }
})

  UserRouter.get("/courses", async (req, res)=>{

    const courses = await coursemodel.find()

    const CourseDetails = courses.map(course => ({
        Title : course.title,
        Description : course.description,
        Price : course.price,
    }))
  ;

    res.json({
        CourseDetails

    })
  })


  UserRouter.post("/enroll", isUser  ,async (req, res)=>{
    const user_id = req.userId ;
    const course_id = req.body.course_id;

    // console.log(user_id);

    const finduserId = await usermodel.findOne({
        _id : user_id
    })

    // console.log(finduserId);
    
    if (!finduserId){
        res.json({
            message: "Invalid user"
        })
        return;
    } 

    const findcourseId =await coursemodel.findOne({
        _id : course_id
    })

    if(!findcourseId){
        res.json({
            message: "Invalid Course Id"
        })
        return;
    }

    const Purchased_course: Ienrolment =await enrollmentmodel.create({
        user_id: user_id,
        course_id: course_id
    })
    
    // const populatedEnrollment = await enrollmentmodel
    //     .findById(Purchased_course._id)
    //     .populate('course_id', 'title')  
    //     .populate('user_id', 'name')     
        

    // res.json({
    //     Purchased_course_id: populatedEnrollment?._id,
    //     course_name: populatedEnrollment?.course_id.title,
    //     student_name: populatedEnrollment?.user_id.name,
    // });

    res.json({
        Purchased_course,
        id: Purchased_course._id
    })

  })


export { UserRouter}

