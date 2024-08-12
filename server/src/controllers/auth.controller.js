import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

const options = {
    httpOnly: true,
    sameSite: 'Strict'
};

// Refresh access token
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token is required');
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) throw new ApiError(403, 'Invalid refresh token');

            const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            res.cookie('accessToken', newAccessToken, options)
                .json(new ApiResponse(200, { accessToken: newAccessToken }, 'Access token refreshed'));
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};