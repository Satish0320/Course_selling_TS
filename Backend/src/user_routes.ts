import express from "express";
import z, { string } from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const JWT_SECRET = "satish0123456789"
import { coursemodel, enrollmentmodel, Ienrolment, Ipayment, paymentmodel, usermodel } from "./Db"
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

    const RandomMoney = Math.floor(Math.random() * 100000)

    const User: Iuser = await usermodel.create({
        name: name,
        email: email,
        password: hashpassword,
        role: role || "student",
        wallet: RandomMoney
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

UserRouter.get("/courses", async (req, res) => {

    const courses = await coursemodel.find()

    const CourseDetails = courses.map(course => ({
        Title: course.title,
        Description: course.description,
        Price: course.price,
    }))
        ;

    res.json({
        CourseDetails

    })
})


UserRouter.post("/Enrolled", isUser, async (req, res) => {
    const user_id = req.userId;
    const course_id = req.body.course_id;
    const payment_id = req.body.payment_id

    // console.log(user_id);

    const finduserId = await usermodel.findOne({
        _id: user_id
    })

    // console.log(finduserId);

    if (!finduserId) {
        res.json({
            message: "Invalid user"
        })
        return;
    }

    const findcourseId = await coursemodel.findOne({
        _id: course_id
    })

    if (!findcourseId) {
        res.json({
            message: "Invalid Course Id"
        })
        return;
    }

    const findpaymentId = await paymentmodel.findOne({
        _id: payment_id
    })

    if (!findpaymentId) {
        res.json({
            message: "Invalid payment Id"
        })
        return
    }

    const Purchased_course: Ienrolment = await enrollmentmodel.create({
        user_id: user_id,
        course_id: course_id,
        payment_id: payment_id
    })

    const Purchased_Details = await enrollmentmodel
        .findById(Purchased_course._id)
        .populate<{ user_id: { name: string } }>("user_id", "name")
        .populate<{ course_id: { title: string } }>("course_id", "title")
        .populate<{ payment_id: { _id: string } }>("payment_id")


    if (!Purchased_Details) {
        res.status(404).json({ message: "Enrollment details not found" });
        return;
    }

    res.json({
        enrollment_id: Purchased_Details._id,
        user_name: Purchased_Details.user_id?.name,
        course_title: Purchased_Details.course_id?.title,
        payment_id: Purchased_Details.payment_id?._id,
    })

})


UserRouter.post("/buy_course/payment", isUser, async (req, res) => {


    const user_id = req.userId;
    const course_id = req.body.course_id;
    const amount = req.body.amount

    const finduser = await usermodel.findOne({
        _id: user_id
    })

    if (!finduser) {
        res.json({
            message: "Invaild user Id"
        })
        return
    }

    const findcourse = await coursemodel.findOne({
        _id: course_id
    })

    if (!findcourse) {
        res.json({
            message: "Invalid course Id"
        })
        return
    }

    if (findcourse < amount) {
        res.json({
            message: "Insufficient funds"
        })
        return
    }

    finduser.wallet -= amount;
    await finduser.save();

    const paymentDetails: Ipayment = await paymentmodel.create({
        user_id: user_id,
        course_id: course_id,
        amount: amount
    })

    const Payment_Details = await paymentmodel
        .findById(paymentDetails._id)
        .populate<{ course_id: { title: string } }>("course_id", "title")
        .populate<{ user_id: { name: string } }>("user_id", "name");


    if (!Payment_Details) {
        res.status(404).json({ message: "Payment details not found" });
        return
    }

    res.json({
        payment_id: Payment_Details._id,
        course_name: Payment_Details.course_id.title,
        user_name: Payment_Details.user_id.name,
        amount: paymentDetails.amount,
        remaining_Balance: finduser.wallet
    });


})


export { UserRouter }

