import express, { Router, Request, Response } from "express";
import { AssignmentModel, SubmissionModel } from "../Schema/db"; 
import multer from 'multer';
import { GEMINI_API_KEY, MAIN_READ_WRITE_TOKEN } from "../Config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { put } from '@vercel/blob';
import fs from "fs/promises";
import path from "path";

const router: Router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 }
});
const apiKey = GEMINI_API_KEY? GEMINI_API_KEY : "null";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(buffer: Buffer, mimeType: string, fileName: string) {
    const tempDir = '/tmp/gemini-uploads'; 
    const tempPath = path.join(tempDir, fileName);

    try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(tempPath, buffer);
        const uploadResult = await fileManager.uploadFile(tempPath, {
        mimeType,
        displayName: fileName,
        });
        
        return uploadResult.file;
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error('Failed to process file upload');
    } finally {
        try {
        await fs.unlink(tempPath);
        console.log(`Cleaned up temp file: ${tempPath}`);
        } catch (cleanupError) {
        console.error('Temp file cleanup error:', cleanupError);
        }
    }
}

async function waitForFilesActive(files: any[]) {
    console.log("Waiting for file processing...");
    for (const name of files.map((file) => file.name)) {
        let file = await fileManager.getFile(name);
        while (file.state === "PROCESSING") {
        process.stdout.write(".");
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        file = await fileManager.getFile(name);
        }
        if (file.state !== "ACTIVE") {
        throw Error(`File ${file.name} failed to process`);
        }
    }
    console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.70,
    topK: 40,
    maxOutputTokens:5000,
    responseMimeType: "text/plain",
};

// POST /api/v1/submissions/data (Handles file upload and initial submission)
router.post("/data", upload.single('assignmentFile'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { Name, Class, Section, RollNo, Department, Email, PhoneNumber, hash } = req.body;
        let ocrTextResult = "OCR processing not performed.";
        let geminiUploadedFile;
        let assignmentFilePath: string | undefined = undefined;
        if (req.file) {
            const file = req.file;
            const { url } = await put(file.originalname, file.buffer, {
                access: 'public', 
                token: MAIN_READ_WRITE_TOKEN,
                addRandomSuffix: true, 
            });
            assignmentFilePath = url;
            try {
                geminiUploadedFile = await uploadToGemini(file.buffer, file.mimetype, file.originalname);
                await waitForFilesActive([geminiUploadedFile]);
                const geminiRequest = {
                    contents: [{
                        role: "user",
                        parts: [
                            {
                                fileData: {
                                    mimeType: geminiUploadedFile.mimeType,
                                    fileUri: geminiUploadedFile.uri,
                                },
                            },
                            { text: "Your job is to extract the handwritten text from the file and provide the extracted data as is, without adding any extra words whatsoever. Behave like a ocr and give the extracted data as you response" },
                        ],
                    }],
                    generationConfig: generationConfig,
                };
                const geminiResponse = await model.generateContent(geminiRequest);
                const responseText = geminiResponse.response.text();
                if (responseText) {
                    ocrTextResult = responseText;
                    console.log("Gemini OCR Result:", ocrTextResult);
                } else {
                    ocrTextResult = "Error during Gemini file upload or processing.";
                    console.error("Gemini OCR failed to extract text.");
                }
            } catch (geminiUploadError: any) {
                console.error("Gemini File Upload or Processing Error:", geminiUploadError);
                ocrTextResult = "Error during Gemini file upload or processing.";
            }
        }
        if (ocrTextResult !== "Error during Gemini file upload or processing.") {
            const newSubmission = await SubmissionModel.create({
                Name,
                Class,
                Section,
                RollNo,
                Department,
                Email,
                PhoneNumber,
                hash,
                assignmentFile: assignmentFilePath,
            });
            res.status(201).json({
                message: 'Submission successful',
                submissionId: newSubmission._id,
                ocrText: ocrTextResult,
            });
        } else {
            res.status(201).json({
                message: 'Submission unsuccessful'
            });
        }
    } catch (error: any) {
        console.error('Error saving submission or during OCR process:', error);
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ message: 'File size exceeds the limit of 5MB.' });
        } else {
            res.status(500).json({ message: 'Failed to submit data or process OCR', error: error.message });
        }
    }
    return;
});

// POST /api/v1/submissions/result (Evaluate submission text using Gemini)
router.post("/result", async (req: Request, res: Response): Promise<void> => {
    try {
        const { ocrText, sub_id } = req.body;
        if (!ocrText || !sub_id) {
          res.status(400).json({ message: "Missing required fields: ocrText and sub_id" });
          return;
        }
        const submission = await SubmissionModel.findById(sub_id);
        if (!submission) {
          res.status(404).json({ message: "Submission not found" });
          return;
        }
        const assignment = await AssignmentModel.findOne({ 
          hash: submission.hash 
        });
        if (!assignment) {
          res.status(400).json({ message: "Linked assignment not found" });
          return;
        }
        const systemInstruction = `You are a professional teacher who critically evaluates student's answers based on multiple factors, including depth, clarity, knowledge, grammar, and tone. Your task is to assess their responses rigorously and assign them a score on a scale of 1 to 100, ensuring that the score appears as the heading of your response. You need to be pretty harsh in your evaluation and can also return 0 if the answer is not upto the mark. The score should be in the format of "Score: <score> / 100". Also the Grade should be in bold to distinguish it from the followed feedback. Following this, you must provide a concise yet insightful analysis of their answer within 150-200 words, highlighting its strengths and weaknesses. After the analysis, generate a detailed, personalized feedback section of up to 500 words, offering constructive suggestions for improvement. Maintain a friendly and encouraging tone throughout your response to ensure the student feels motivated and supported in their learning journey.`;
        const userContent = `Name: ${submission.Name || "Student"}\nQuestions: ${assignment.Questions}\nAnswer: ${ocrText}`;
        const geminiResponse = await model.generateContent({
          contents: [{
            role: "user",
            parts: [
              { text: systemInstruction },
              { text: userContent }
            ]
          }],
          generationConfig
        }).catch(err => {
          throw new Error(`Gemini API Error: ${err.message}`);
        });
        const evaluationResultText = geminiResponse.response.text();
        if (!evaluationResultText) {
          throw new Error("Empty response from Gemini");
        }
        submission.evaluationResult = evaluationResultText;
        await submission.save();
        res.status(200).json({
          message: "Evaluation successful",
          result: evaluationResultText
        });
    
      } catch (error: any) {
        console.error("Result route error:", error);
        if (!res.headersSent) {
          const statusCode = error.message.includes("not found") ? 404 : 500;
          res.status(statusCode).json({
            message: "Evaluation failed",
          });
        }
      }
});

export default router;