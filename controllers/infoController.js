import Info from '../models/info.js';
import pkg from 'crypto-js';
import { decryptData } from '../utils/function.js';
export const getInfoByMssv = async (req, res) => {
    const { mssv } = req.query;
    const info = await Info.findOne({ mssv });
    if (!info) return res.status(404).json({ error: 'MSSV không tồn tại' });
    res.json(info);
};

export const createInfo = async (req, res) => {
    const { mssv, name, khoa, email } = req.body;
    const existingInfo = await Info.findOne({ mssv });
    if (existingInfo && existingInfo.result !== undefined) return res.status(400).json({ error: 'MSSV đã tồn tại' });
    if (!existingInfo) {
        const newInfo = new Info({ mssv, name, khoa, email });
        await newInfo.save();
        return res.json(newInfo);
    }
    return res.json(existingInfo)
};




// API update-result
export const updateResult = async (req, res) => {
    try {
        //prevent calling api by postman by checking postman-token from headers 
        //or use the one time token from body 
        if (req.headers['postman-token']) {
            return res.status(400).json({ error: 'May khong the update bang postman dau' });
        }
        const encryptedMssv = req.headers['secretkey'];
        console.log(encryptedMssv);
        if (!encryptedMssv) return res.status(400).json({ error: 'Thiếu secretKey' });

        // Giải mã secretKey để lấy mssv
        const mssv = decryptData(encryptedMssv);
        const { result } = req.body;
        // Tìm và cập nhật thông tin theo mssv
        const info = await Info.findOneAndUpdate({ mssv: JSON.parse(mssv) }, { result }, { new: true });
        if (!info) return res.status(404).json({ error: 'MSSV không tồn tại' });

        res.json(info);
    } catch (error) {
        console.error('Lỗi giải mã hoặc cập nhật:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra' });
    }
};