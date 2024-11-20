import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    question: String,
    correct_answer: { type: [String], required: true },
    question_id: String
});

const Question = mongoose.model('Question', QuestionSchema);
export default Question;