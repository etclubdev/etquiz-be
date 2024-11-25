import mongoose from 'mongoose';

const InfoSchema = new mongoose.Schema({
    name: String,
    mssv: { type: String, unique: true },
    khoa: String,
    email: String,
    quantity: Number,
    result: Number,
});

const Info = mongoose.model('Info', InfoSchema);
export default Info;