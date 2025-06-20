import { NextFunction, Response, Request } from "express";
import { JWT_PASSWORD } from "../Config/config";
import jwt from "jsonwebtoken";


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.token;
    if(!JWT_PASSWORD){
        res.status(403).json({
            message: "Server Error"
        })
    } else {
        const decoded = jwt.verify(header as string, JWT_PASSWORD)
    
        if(decoded){
            //@ts-ignore
            req.userId = decoded.id;
            next()
        } else{
            res.status(403).json({
                message: "Invalid token"
            })
        }
    }
    
}