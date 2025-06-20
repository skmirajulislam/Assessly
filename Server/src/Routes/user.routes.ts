import express, { Router, Request, Response } from "express";
import { UserModel } from "../Schema/db"; 
import { userMiddleware } from "../Middleware/middleware"; 

const router: Router = Router();

// /api/v1/users/data
router.get("/data", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId; 
    try {
        const data = await UserModel.findOne({
            _id: userId
        });

        if(data) {
            res.json({ 
                info: data
            });
            return;
        }
        res.status(404).json({ 
            data: "Error user not Found!"
        });
    } catch (error: any) {
        console.error(`Error fetching user data for ID ${userId}:`, error);
        res.status(500).json({
            message: "Failed to retrieve user data.",
            error: error.message 
        });
        return;
    }
});

export default router;