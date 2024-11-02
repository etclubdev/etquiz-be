import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    question_id: String,
    answer: String,
    answer_id: String,
});

const Answer = mongoose.model('Answer', AnswerSchema);
export default Answer;