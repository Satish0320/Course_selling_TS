import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = "satish0123456789"


interface Idecode {
    userId: string;
    role: string;

}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            message: "Authorization token is missing."
        });
        return
    }
    const decode = jwt.verify(authorization, JWT_SECRET) as Idecode;
    // console.log("Decoded token:", decode)

    if (!decode || decode.role !== "admin") {
        res.json({
            message: "Access denied. Admins only."
        })
        return;
    }
    (req as any).userId = decode.userId
    next();
}


export const isUser = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            message: "Authorization token is missing."
        });
        return
    }

    const decode = jwt.verify(authorization, JWT_SECRET) as Idecode
    // console.log("Decoded token:", decode)
    if (decode.role !== "student") {
        res.json({
            message: "Acces denied, Students only"
        })
        return;
    }

    (req as any).userId = decode.userId
    next();

}

