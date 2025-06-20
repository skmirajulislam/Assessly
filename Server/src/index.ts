import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from './Routes/auth.routes';
import assignmentRoutes from './Routes/assignment.routes';
import submissionRoutes from './Routes/submission.routes';
import userRoutes from './Routes/user.routes';
import testRoutes from './Routes/test.route'

const app = express();
app.use(express.json());
const corsOptions: cors.CorsOptions = {
    origin: [
      'https://assessly-h4b.vercel.app',
      'https://assessly-h4b-git-*.vercel.app',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'token',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-File-Name',
      'Content-Disposition'
    ],
    exposedHeaders: [
      'Content-Disposition', 
      'X-Submission-ID',    
      'X-RateLimit-Limit',   
      'X-RateLimit-Remaining'

    ],
    credentials: true, 
    maxAge: 86400, 
    optionsSuccessStatus: 204 
};

app.use(cors(corsOptions));

declare global{
    namespace Express{
        export interface Request{
            userId?: string
        }
    }
}

app.get("/", (req: Request, res: Response) => {
    res.json({
            message: "Server is alive!"
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/assignments", assignmentRoutes); 
app.use("/api/v1/submissions", submissionRoutes); 
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tests", testRoutes);

const PORT = 3000;
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
});
