import { Router, Request, Response } from "express";
import { AssignmentModel, SubmissionModel } from "../Schema/db"; 
import { userMiddleware } from "../Middleware/middleware"; 
import { randomHash, InnerObjectType, FilteredObjectType, filterObjectProperties, filterSecondObjectProperties, FilteredSecondObjectType, ThirdFilteredObjectType, ThirdfilterObjectProperties } from "../utils/utils"; 
import { createObjectCsvStringifier } from 'csv-writer'; 

const router: Router = Router();

// POST /api/v1/assignments/generate
router.post("/generate", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const {
        Name, Class, Section, RollNo, Department, Email, PhoneNumber,
        Questions, Title, Description, Deadline
    } = req.body;
    const userId = req.userId;
    if (!Title || !Questions || !Deadline) {
         res.status(400).json({ message: "Title, Questions, and Deadline are required." });
         return;
    }
    const hashed = randomHash(8, userId? userId: ""); 
    console.log("Request Body received at /generate:", req.body);
    console.log("User ID from middleware:", userId);

    try {
        const newAssignment = await AssignmentModel.create({
            Name: Name || false,
            Class: Class || false,
            Section: Section || false,
            RollNo: RollNo || false,
            Department: Department || false,
            Email: Email || false,
            PhoneNumber: PhoneNumber || false,
            hash: hashed,
            Questions,
            userId,
            Title,
            Description,
            Deadline
        });
        res.status(201).json({ hash: hashed, assignmentId: newAssignment._id }); 
    } catch (e: any) {
        console.error("Error in /generate:", e);
        res.status(500).json({
            message: "Failed to generate assignment.",
            error: e.message,
        });
    }
});

// GET /api/v1/assignments/latest/all
//ASSIGNMENT SECTION K LIA
router.get("/latest/all", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    try {
        const data: InnerObjectType[] = await AssignmentModel.find({ userId }); 
        if (!data || data.length === 0) {
            res.status(404).json({
                message: "Data Not Found"
            });
            return;
        }
        const filteredData: FilteredObjectType[] = filterObjectProperties(data);
        res.json({
            data: filteredData
        });

    } catch (error) {
        console.error("Error fetching user's assignments:", error);
        res.status(500).json({
            message: "Internal Server Error fetching assignments"
        });
    }
});
// DELETE /api/v1/assignments/delete
router.delete('/delete', userMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.body;
        const userId = req.userId; 
        if (!_id) {
            res.status(400).json({ success: false, message: 'Missing assignment ID' });
            return;
        }
        const deletedAssignment = await AssignmentModel.findOneAndDelete({
            _id,
            userId 
        });
        if (!deletedAssignment) {
            res.status(404).json({ success: false, message: 'Assignment not found' });
            return;
        }
        res.json({ 
            success: true, 
            message: 'Assignment deleted successfully',
            deletedId: _id
        });
    } catch (error: any) {
        console.error('Delete assignment error:', error);
        if (error.name === 'CastError') {
             res.status(400).json({ success: false, message: 'Invalid assignment ID format.' });
             return;
        }
        res.status(500).json({
            success: false,
            message: 'Failed to delete assignment',
            error: error.message
        });
    }
});

//DASHBOARD K LIAAA
router.get("/", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    try {
        const data = await AssignmentModel.find({
            userId: userId
        });
        const assignmentHashes: string[] = data.map(assignment => assignment.hash).filter((hash): hash is string => hash !== undefined);
        const submissionCounts: number[] = [];
        for (const hash of assignmentHashes) {
            const submissions = await SubmissionModel.find({ hash: hash });
            submissionCounts.push(submissions.length);
        }
        if(data) {
            res.json({ 
                info: data,
                submissionCounts: submissionCounts
            });
            return;
        }
        res.status(404).json({ 
            data: "Error user not Found!"
        });

    } catch (error: any) {
        console.error("Error fetching assignments with counts:", error);
        res.status(500).json({
            message: "Failed to fetch assignments",
            error: error.message
        });
    }
});

//SUBMISSIONS PAGE K LIAA
router.get("/latest", userMiddleware, async(req: Request, res: Response):Promise<void>=>{
    const userId = req.userId;
    const data: InnerObjectType[] = await AssignmentModel.find({userId})
    if (!data || data.length === 0) {
        res.status(404).json({
            message: "Data Not Found"
        });
        return;
    }
    const assignmentHashes: string[] = data.map(assignment => assignment.hash).filter((hash): hash is string => hash !== undefined);
    const submissionCounts: number[] = [];
    for (const hash of assignmentHashes) {
        const submissions = await SubmissionModel.find({ hash: hash });
        submissionCounts.push(submissions.length);
    }
    const filteredData: ThirdFilteredObjectType[] = ThirdfilterObjectProperties(data);
    res.status(200).json({
        assignments: filteredData, 
        submissionCounts: submissionCounts, 
        message: "Data Fetched Successfully"
    });

})

// GET /api/v1/assignments/share/:shareId
router.get("/share/:shareId", async (req: Request, res: Response): Promise<void> => {
    const hash = req.params.shareId;
    try {
        const data = await AssignmentModel.findOne({ hash: hash }) as InnerObjectType | null; 

        if (!data) {
            res.status(404).json({
                message: "Assignment not found for the provided share link"
            });
        } else {
            const filteredData: FilteredSecondObjectType = filterSecondObjectProperties(data);
            res.status(200).json({
                info: filteredData
            });
        }
    } catch (error) {
        console.error("Error fetching shared assignment:", error);
        res.status(500).json({
            message: "Failed to retrieve assignment details. Please try again later."
        });
    }
});

router.post("/export", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const hash = req.body.hash;
        if (!hash) {
            res.status(400).send("Hash query parameter is required.");
            return
        }
        const submissions = await SubmissionModel.find({hash: hash})
        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'Name', title: 'Name' },
                { id: 'Class', title: 'Class' },
                { id: 'Section', title: 'Section' },
                { id: 'RollNo', title: 'RollNo' },
                { id: 'Department', title: 'Department' },
                { id: 'Email', title: 'Email' },
                { id: 'PhoneNumber', title: 'PhoneNumber' },
                { id: 'hash', title: 'Hash' },
                { id: 'evaluationResult', title: 'EvaluationResult' },
                { id: 'assignmentFile', title: 'AssignmentFile' },
                { id: '_id', title: 'Submission ID'},
            ]
        });

        const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(submissions);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
        res.status(200).send(csvData);

    } catch (error: any) {
        console.error("Error generating CSV for submissions:", error);
        res.status(500).send("Error generating CSV for submissions");
    }
    return
});


export default router;