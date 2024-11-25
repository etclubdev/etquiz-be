import Info from '../models/info.js';
import pkg from 'crypto-js';
import { decryptData } from '../utils/function.js';
import xlsx from 'xlsx';
export const getInfoByMssv = async (req, res) => {
    const { mssv } = req.query;
    const info = await Info.findOne({ mssv });
    if (!info) return res.status(404).json({ error: 'MSSV không tồn tại' });
    res.json(info);
};

export const createInfo = async (req, res) => {
    const { mssv, name, khoa, email } = req.body;
    const existingInfo = await Info.findOne({ mssv });
    if (existingInfo && existingInfo.quantity === 0 && existingInfo.result !== undefined) return res.status(400).json({ error: 'MSSV đã tồn tại. Bạn đã hết lượt thi' });
    if (!existingInfo) {
        const newInfo = new Info({ mssv, name, khoa, email, quantity: 2 });
        await newInfo.save();
        return res.json(newInfo);
    }
    return res.json(existingInfo)
};

export const exportExcelFile = async (req, res) => {
    try {
        const infos = await Info.find();

        const data = infos.map(info => ({
            'Họ và tên': info.name,
            'MSSV': info.mssv,
            'Khóa': info.khoa,
            'Email': info.email,
            'Kết quả': info.result
        }));

        const ws = xlsx.utils.json_to_sheet(data);

        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Info');

        const filePath = './Info.xlsx';
        xlsx.writeFile(wb, filePath);

        res.download(filePath, 'Info.xlsx', (err) => {
            if (err) {
                res.status(500).send('Lỗi khi tải file');
            }
        });
    } catch (err) {
        res.status(500).send('Lỗi khi xuất file: ' + err.message);
    }
}



// API update-result
export const updateResult = async (req, res) => {
    try {
        //prevent calling api by postman by checking postman-token from headers 
        //or use the one time token from body 
        if (req.headers['postman-token']) {
            return res.status(400).json({ error: 'May khong the update bang postman dau' });
        }
        const encryptedMssv = req.headers['secretkey'];
        if (!encryptedMssv) return res.status(400).json({ error: 'Thiếu secretKey' });

        // Giải mã secretKey để lấy mssv
        const mssv = decryptData(encryptedMssv);
        const { result } = req.body;

        const info = await Info.findOne({ mssv: JSON.parse(mssv) });

        if (!info) return res.status(404).json({ error: 'MSSV không tồn tại' });

        // Kiểm tra nếu result mới nhỏ hơn result cũ
        if (parseFloat(result) < parseFloat(info.result)) {
            const updatedInfo = await Info.findOneAndUpdate(
                { mssv: JSON.parse(mssv) },
                { $inc: { quantity: -1 } },
                { new: true }
            );
            return res.json(updatedInfo);
        }

        const updatedInfo = await Info.findOneAndUpdate(
            { mssv: JSON.parse(mssv) },
            {
                result,
                $inc: { quantity: -1 }
            },
            { new: true }
        );

        res.json(updatedInfo);
    } catch (error) {
        console.error('Lỗi giải mã hoặc cập nhật:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra' });
    }
};