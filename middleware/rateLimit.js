const rateLimit = {};

const apiRateLimiter = (req, res, next) => {
    const userIP = req.ip; // Lấy địa chỉ IP của người dùng
    console.log('userIp', userIP);
    const currentTime = Date.now(); // Thời gian hiện tại (ms)

    // Nếu không có record nào cho IP, khởi tạo
    if (!rateLimit[userIP]) {
        rateLimit[userIP] = [];
    }

    // Lọc các yêu cầu trong vòng 1 giây trước
    rateLimit[userIP] = rateLimit[userIP].filter(timestamp => currentTime - timestamp < 2000);
    console.log('rateLimit', rateLimit)

    // Nếu số lượng yêu cầu vượt quá 10, từ chối
    if (rateLimit[userIP].length >= 6) {
        return res.status(429).json({ error: 'Ngăn chặn spam request.' });
    }

    // Thêm thời gian gọi hiện tại vào danh sách
    rateLimit[userIP].push(currentTime);

    next(); // Tiếp tục xử lý request
};

export default apiRateLimiter;