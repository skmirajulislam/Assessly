import mongoose, { model, Schema } from "mongoose";
import { MONGO_URL } from "../Config/config";

mongoose.connect(MONGO_URL? MONGO_URL: "null")

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: {type: String, unique : true},
    password: String
})
const TestSchema = new Schema ({
    title: { type: String },
    subject: { type: String },
    description: { type: String },
    numQuestions: { type: Number },
    difficulty: { type: String },
    testDateTime: { type: String}, 
    hash: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdAt: { type: Date, default: Date.now }
});

const TestSubmissionSchema = new Schema ({
    studentName: { type: String },
    testHash: { type: String },
    submittedAt: { type: Date, default: Date.now },
    questions: [{ question: { type: String } }], 
    answers: [{ answer: { type: String } }], 
    score: { type: Number, min: 0, max: 100 }, 
    evaluationPrompt: { type: String },
    evaluationResponse: { type: String }
});

const AssignmentSchema = new Schema({
   Name: Boolean,
   Class: Boolean,
   Section: Boolean,
   RollNo: Boolean,
   Department: Boolean,
   Email: Boolean,
   PhoneNumber: Boolean,
   hash: String,
   Questions: String,
   Title: String,
   Description: String,
   Deadline: String,
   userId: {type: mongoose.Types.ObjectId, ref: "User", required: true}
})

const SubmissionSchema: Schema = new Schema({
    Name: { type: String },
    Class: { type: String },
    Section: { type: String },
    RollNo: { type: String },
    Department: { type: String },
    Email: { type: String },
    PhoneNumber: { type: String },
    hash: {type: String},
    evaluationResult: {type: String},
    assignmentFile: { type: String }, // Store the file path or filename in the database
  })

export const UserModel = model("User", UserSchema );
export const AssignmentModel = model("Assignment", AssignmentSchema); 
export const SubmissionModel = model("Submissions", SubmissionSchema)
export const TestModel = model("Test", TestSchema);
export const TestSubmissionModel = model("TestSubmission", TestSubmissionSchema);