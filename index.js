import express from 'express';
import connectDB from './config/database.js';
import dotenv from 'dotenv';
import infoRoutes from './routes/infoRoutes.js';
import examRoutes from './routes/examRoutes.js';
import { answers, questions } from './samples/data.js';
import Question from './models/question.js';
import Answer from './models/answer.js';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = ['https://etquiz-be.vercel.app', 'http://localhost:5173', 'https://etquiz-fe.vercel.app'];
app.use(cors({
    origin: function (origin, callback) {
        console.log('orgin', origin)
        if (allowedOrigins.indexOf(origin) !== -1 || origin === undefined) {
            callback(null, true);
        } else {
            callback(new Error(`CORS not allowed for origin ${origin}`));
        }
    }
}));
const initializeDatabase = async () => {
    try {
        // Kết nối đến cơ sở dữ liệu
        await connectDB();

        // // Xóa tất cả dữ liệu trong bảng questions và answers
        // await Question.deleteMany({});
        // await Answer.deleteMany({});

        // // Thêm dữ liệu mới vào bảng questions
        // await Question.insertMany(questions);
        // console.log('Cập nhật câu hỏi thành công!');

        // // Thêm dữ liệu mới vào bảng answers
        // await Answer.insertMany(answers);
        // console.log('Cập nhật câu trả lời thành công!');

    } catch (error) {
        console.error('Có lỗi xảy ra trong quá trình khởi tạo cơ sở dữ liệu:', error);
    }
};

initializeDatabase(); // Gọi hàm khởi tạo cơ sở dữ liệu

app.use('/api', infoRoutes);
app.use('/api', examRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});