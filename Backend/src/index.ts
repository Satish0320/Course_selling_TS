import express from "express";
import z, { string } from "zod";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";
const  JWT_SECRET =  "satish0123456789"
import  {usermodel}  from "./Db"
import  {Iuser}  from "./Db"

const app = express();
app.use(express.json());

app.post("/user/signup",async (req, res)=>{
    
    const requirebody = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.string()
    }) 
    const validaterequirebosy = requirebody.safeParse(req.body);

    if (!validaterequirebosy.success) {
        res.json({
            message:"invalid inputs",
            error: validaterequirebosy.error
        })
        return;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role

    const hashpassword = await bcrypt.hash(password, 5);

    const newUser: Iuser = await usermodel.create({
        name: name,
        email: email,
        password: hashpassword,
        role: role || "student"
    })

    res.json({
        message: "User created",
        newUser
    })

})

app.post("/user/signin",async (req,res)=>{

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
    const payload = {userId : finduser._id, role: finduser.role}
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


app.listen(4000);