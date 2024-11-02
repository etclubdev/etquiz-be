import Question from '../models/question.js';
import Answer from '../models/answer.js';
import { encryptData } from '../utils/function.js';

export const getExam = async (req, res) => {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    const questionIds = questions.map(q => q.question_id);
    const answers = await Answer.find({ question_id: { $in: questionIds } }).limit(40);
    const encodedAnswerQuestion = questions.map(q => ({ ...q, correct_answer: encryptData(q.correct_answer) }));
    res.json({
        questions: encodedAnswerQuestion,
        answers,
    });
};