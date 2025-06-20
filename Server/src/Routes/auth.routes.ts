import  { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../Schema/db"; 
import { JWT_PASSWORD } from "../Config/config";

const router: Router = Router();
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, username, password } = req.body;
    if (!firstName || !lastName || !username || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            res.status(409).json({ 
                message: "Username already exists"
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 4); 
        await UserModel.create({
            firstName,
            lastName,
            username,
            password: hashedPassword
        });
        res.status(201).json({ 
            message: "User Signed Up Successfully!"
        });
    } catch (error: any) {
        console.error("Signup Error:", error);
        res.status(500).json({
            message: "Failed to sign up user",
            error: error.message
        });
    }
});

router.post("/signin", async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
    }

    try {
        const userExists = await UserModel.findOne({ username });

        if (!userExists || !userExists.password) {
            res.status(401).json({ 
                message: "Incorrect Credentials"
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, userExists.password);

        if (!passwordMatch) {
            res.status(401).json({
                message: "Incorrect Credentials"
            });
            return;
        }
        if (!JWT_PASSWORD) {
            console.error("JWT_PASSWORD environment variable is not set!");
            res.status(500).json({ message: "Internal Server Error: Authentication configuration missing" });
            return;
        }

        const token = jwt.sign({
            id: userExists._id 
        }, JWT_PASSWORD, { expiresIn: '1d' }); 

        res.json({
            token: token,
            message: "Sign in successful"
        });

    } catch (error: any) {
        console.error("Signin Error:", error);
        res.status(500).json({
            message: "Failed to sign in",
            error: error.message
        });
    }
});

export default router;