import { Router, Request, Response } from "express";
import { TestModel, TestSubmissionModel } from "../Schema/db"; 
import { userMiddleware } from "../Middleware/middleware"; 
import { randomHash } from "../utils/utils"; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../Config/config"; 
import mongoose from "mongoose";
import { createObjectCsvStringifier } from 'csv-writer'; 

const apiKey = GEMINI_API_KEY? GEMINI_API_KEY : "null";
const genAI = new GoogleGenerativeAI(apiKey);
const router: Router = Router();
const testGenerationModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});
const testEvaluationModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

router.get("/tests", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    try {
        const userTests = await TestModel.find({ userId: userId }).lean();
        res.status(200).json({
            tests: userTests 
        });
    } catch (error: any) {
        console.error(`Error fetching tests for user ${userId}:`, error);
        res.status(500).json({ message: "Server error while fetching your tests." });
    }
});

// POST /api/v1/tests/create
router.post("/create", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { title, subject, description, numQuestions, difficulty, testDateTime } = req.body;
    const userId = req.userId;
    if (!title || !subject || !description || !numQuestions || !difficulty || !testDateTime) {
        res.status(400).json({ message: "Missing required fields for test creation." });
        return;
    }
    if (typeof numQuestions !== 'number' || numQuestions < 1) {
         res.status(400).json({ message: "Number of questions must be a positive integer." });
         return;
    }
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        res.status(400).json({ message: "Difficulty must be 'easy', 'medium', or 'hard'." });
        return;
    }
    try {
        const testHash = randomHash(10, userId? userId : ""); 
        const newTest = new TestModel({
            title,
            subject,
            description,
            numQuestions,
            difficulty,
            testDateTime: new Date(testDateTime), 
            hash: testHash,
            userId: new mongoose.Types.ObjectId(userId) 
        });

        await newTest.save();

        console.log(`Test created by user ${userId} with hash ${testHash}`);
        res.status(201).json({
            message: "Test created successfully!",
            hash: testHash
        });
    } catch (error: any) {
        console.error("Error creating test:", error);
         if (error.name === 'ValidationError') {
             res.status(400).json({ message: "Test validation failed.", errors: error.errors });
         } else {
             res.status(500).json({ message: "Failed to create test due to server error." });
         }
    } return;
});

router.get("/questions/:hash", async (req: Request, res: Response): Promise<void> => {
    const { hash } = req.params;
    if (!apiKey) {
        res.status(503).json({ message: "Test generation service unavailable." });
        return;
    }
    try {
        const testDefinition = await TestModel.findOne({ hash });

        if (!testDefinition) {
            res.status(404).json({ message: "Test not found or link expired." });
            return;
        }

        const generationPrompt = `
          Generate a test based on the following details.
          Respond ONLY with the questions formatted as a numbered list, one question per line.
          Each line MUST start with the question number, followed by a closing parenthesis, a space, and then the question text.
          Use a single newline character ('\\n') to separate each question.
          There should be exactly ${testDefinition.numQuestions} lines in your response, each corresponding to one question.

          Example for 3 questions:
          1) What is the capital of Spain?
          2) Describe the process of photosynthesis.
          3) Solve for y: 3y - 5 = 10

          Do NOT include any introductory text, explanations, titles, summaries, markdown formatting, or any other text before the first question or after the last question.
          Only include the ${testDefinition.numQuestions} numbered questions separated by newlines.

          Test Details:
          - Subject: ${testDefinition.subject}
          - Title: ${testDefinition.title}
          - Description/Type: ${testDefinition.description}
          - Number of Questions: ${testDefinition.numQuestions}
          - Difficulty: ${testDefinition.difficulty}
        `;

        console.log(`Generating questions for test hash: ${hash} (Numbered list format)`);

        const result = await testGenerationModel.generateContent({
            contents: [{ role: "user", parts: [{ text: generationPrompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096
            },
        });

        const response = result.response;
        const responseText = response.text();

        if (!responseText) {
            console.error(`Gemini returned empty response for question generation (hash: ${hash}). Finish Reason: ${response.promptFeedback?.blockReason || response.candidates?.[0]?.finishReason || 'Unknown'}`);
            throw new Error("AI failed to generate questions (empty response).");
        }
        const lines = responseText.trim().split('\n');
        const extractedQuestions: string[] = [];
        const lineErrors: string[] = [];
        const lineStartRegex = /^\d+\)\s+/;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '') {
                continue;
            }

            if (lineStartRegex.test(trimmedLine)) {
                const questionText = trimmedLine.replace(lineStartRegex, '').trim();
                if (questionText) {
                    extractedQuestions.push(questionText);
                } else {
                    lineErrors.push(`Line matched format but had no text: "${trimmedLine}"`);
                }
            } else {
                lineErrors.push(`Line did not match expected format 'number) question': "${trimmedLine}"`);
            }
        }

        if (lineErrors.length > 0) {
            console.warn(`Found ${lineErrors.length} lines with format issues for hash ${hash}:`, lineErrors);
            throw new Error(`AI response format was invalid. ${lineErrors.length} lines did not match the required 'number) question' format.`);
        }

        if (extractedQuestions.length === 0 && responseText.trim() !== '') {
            throw new Error("AI response format was invalid. Could not extract any questions in the 'number) question' format.");
        }

        if (extractedQuestions.length !== testDefinition.numQuestions) {
             console.warn(`Gemini returned ${extractedQuestions.length} valid questions, but ${testDefinition.numQuestions} were requested (hash: ${hash}).`);
             throw new Error(`AI response format error: Expected ${testDefinition.numQuestions} questions, but successfully parsed ${extractedQuestions.length}.`);
        }

        console.log(`Successfully parsed ${extractedQuestions.length} questions in numbered list format for test hash: ${hash}`);
        console.log(extractedQuestions);
        res.status(200).json({
            title: testDefinition.title,
            subject: testDefinition.subject,
            questions: extractedQuestions
        });

    } catch (error: any) {
        console.error(`Error fetching/generating questions for hash ${hash}:`, error);
        if (error.message.includes("Test not found")) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("AI failed") || error.message.includes("AI response format")) {
            res.status(502).json({ message: `Error generating test questions: ${error.message}` });
        } else {
            res.status(500).json({ message: "Server error while retrieving test questions." });
        }
    } return;
});


// POST /api/v1/tests/submit/:hash
router.post("/submit/:hash", async (req: Request, res: Response): Promise<void> => {
    const { hash } = req.params;
    const { studentName, submissions } = req.body;
    if (!studentName || !submissions || !Array.isArray(submissions) || submissions.length === 0) {
        res.status(400).json({ message: "Missing student name or submissions array." });
        return;
    }
    const isValidSubmissionFormat = submissions.every(sub =>
        typeof sub === 'object' && sub !== null &&
        typeof sub.question === 'string' &&
        typeof sub.answer === 'string' 
    );
    if (!isValidSubmissionFormat) {
        res.status(400).json({ message: "Submissions array contains invalid entries. Each must have 'question' and 'answer' strings." });
        return;
    }

    if (!apiKey) {
        res.status(503).json({ message: "Test evaluation service unavailable." });
        return;
    }

    try {
        const testExists = await TestModel.exists({ hash });
        if (!testExists) {
             res.status(404).json({ message: "Test not found or link expired." });
             return;
        }

        let evaluationContent = "Evaluate the student's answers based on the questions provided.\n\n";
        submissions.forEach((sub, index) => {
            evaluationContent += `Question ${index + 1}: ${sub.question}\n`;
            evaluationContent += `Student Answer ${index + 1}: ${sub.answer}\n\n`;
        });

        const evaluationPrompt = `
          ${evaluationContent}

          Based on the questions and the student's answers, provide a single overall score for this submission.
          The score MUST be a single integer number between 0 and 100 (inclusive).
          Respond ONLY with the numeric score. Do NOT include any other text, explanations, symbols (like '/100' or '%'), or formatting. Just the number.
        `;

        console.log(`Evaluating submission by ${studentName} for test hash: ${hash}`);

        const result = await testEvaluationModel.generateContent({
            contents: [{ role: "user", parts: [{ text: evaluationPrompt }] }],
            generationConfig: {
                temperature: 0.2, 
                maxOutputTokens: 10 
            },
        });

        const response = result.response;
        const scoreText = response.text()?.trim(); 

        if (!scoreText) {
             console.error(`Gemini returned empty response for evaluation (hash: ${hash}, student: ${studentName}). Finish Reason: ${response.promptFeedback?.blockReason || response.candidates?.[0]?.finishReason || 'Unknown'}`);
             throw new Error("AI failed to evaluate the submission (empty response).");
        }
        const score = parseInt(scoreText, 10);
        if (isNaN(score) || score < 0 || score > 100) {
            console.error(`Gemini returned invalid score format: "${scoreText}" (hash: ${hash}, student: ${studentName})`);
            throw new Error("AI returned an invalid score format.");
        }

        console.log(`Successfully evaluated submission. Score: ${score} for student ${studentName}, test hash ${hash}`);
        const newSubmission = new TestSubmissionModel({
            studentName,
            testHash: hash,
            questions: submissions.map(s => ({ question: s.question })),
            answers: submissions.map(s => ({ answer: s.answer })),    
            score: score,
            evaluationPrompt: evaluationPrompt, 
            evaluationResponse: scoreText 
        });

        await newSubmission.save();

        res.status(201).json({
            message: "Test submitted and evaluated successfully!",
            score: score,
            submissionId: newSubmission._id
        });

    } catch (error: any) {
        console.error(`Error submitting/evaluating test for hash ${hash}, student ${studentName}:`, error);
         if (error.message.includes("Test not found")) {
             res.status(404).json({ message: error.message });
        } else if (error.message.includes("AI failed") || error.message.includes("AI returned an invalid score format")) {
            res.status(502).json({ message: `Error evaluating submission: ${error.message}` });
        } else if (error.name === 'ValidationError') {
            res.status(400).json({ message: "Submission data validation failed.", errors: error.errors });
        }
         else {
            res.status(500).json({ message: "Server error during test submission or evaluation." });
        }
    } return;
});

router.post("/export", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { hash } = req.body;
    const userId = req.userId;

    if (!hash) {
        res.status(400).json({ message: "Test hash is required in the request body." });
        return;
    }
    try {
        const testDefinition = await TestModel.findOne({ hash: hash, userId: userId });
        if (!testDefinition) {
            res.status(404).json({ message: "Test not found or you are not authorized to export results for this test." });
            return;
        }

        const submissions = await TestSubmissionModel.find(
            { testHash: hash },
            { studentName: 1, score: 1, _id: 0 }
        ).lean();

        if (!submissions || submissions.length === 0) {
            res.status(404).json({ message: "No submissions found for this test yet." });
            return;
        }

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'studentName', title: 'Student Name' },
                { id: 'score', title: 'Score' }
            ]
        });

        const scoredSubmissions = submissions.filter(sub => typeof sub.score === 'number');

        if (scoredSubmissions.length === 0) {
             res.status(404).json({ message: "No evaluated submissions found for this test yet." });
             return;
        }

        const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(scoredSubmissions);
        const filename = `test_results_${hash}_${Date.now()}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(csvData);

    } catch (error: any) {
        console.error(`Error exporting results for test hash ${hash}:`, error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Server error while exporting test results." });
        }
    }
});

export default router;