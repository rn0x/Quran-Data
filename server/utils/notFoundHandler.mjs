// utils/notFoundHandler.js
export default (req, res) => {
    // Get the current date and time
    const now = new Date();
    const currentDate = now.toISOString();
    const requestMethod = req.method;
    const requestUrl = req.originalUrl;

    res.status(404).json({
        success: false,
        timestamp: currentDate,
        method: requestMethod,
        url: requestUrl,
        error: '📄 Page Not Found.',
        message: '🔍 Please check the URL or return to the homepage.',
        suggestion: '👥 If you need assistance, please contact support.\n⤷ https://github.com/rn0x',
    });
};