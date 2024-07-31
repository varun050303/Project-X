// src/middleware/errorHandler.js
const errorHandler = (err, _, res, _) => {
    console.error(err.stack); // Log the error stack

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: {
                message: err.message || 'Validation Error',
            },
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            error: {
                message: 'Invalid ID format',
            },
        });
    }

    if (err.status) {
        return res.status(err.status).json({
            error: {
                message: err.message || 'Error occurred',
            },
        });
    }

    res.status(500).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
};

export default errorHandler;