const rateLimit = {};

const apiRateLimiter = (req, res, next) => {
    const userIP = req.headers['x-forwarded-for']; // Lấy địa chỉ IP của người dùng
    const currentTime = Date.now(); // Thời gian hiện tại (ms)

    if (!rateLimit[userIP]) {
        rateLimit[userIP] = [];
    }

    rateLimit[userIP] = rateLimit[userIP].filter(timestamp => currentTime - timestamp < 2000);

    if (rateLimit[userIP].length >= 6) {
        return res.status(429).json({ error: 'Ngăn chặn spam request.' });
    }

    rateLimit[userIP].push(currentTime);

    next();
};

export default apiRateLimiter;