// utils/errorUtils.js
export const handleError = (res, statusCode, errorMessage, additionalDetails = {}) => {
    const errorDetails = {
        timestamp: new Date().toISOString(),
        method: res.req.method,
        path: res.req.originalUrl,
        ...additionalDetails
    };
    res.status(statusCode).json({
        success: false,
        error: `⚠️ ${errorMessage}`,
        ...errorDetails,
    });
};