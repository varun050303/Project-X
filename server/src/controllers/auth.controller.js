import jwt, { decode } from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

const options = {
    httpOnly: true,
    sameSite: 'Strict'
};

const authCookieName = process.env.AUTH_COOKIE_NAME

export const verifyToken = (req, res) => {
    const token = req.cookies[authCookieName]; // Retrieve the token from the HTTP-only cookie

    // If no token is provided, return an error response
    if (!token) {
        return res.status(401).json(
            new ApiResponse(401, { isValid: false }, 'Token not provided')
        );
    }

    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        // If token is valid, return a success response with user data
        return res.status(200).json(
            new ApiResponse(200, { isValid: true, user: decoded }, 'Token is valid')
        );
    } catch (error) {
        // If token is invalid, return an error response
        return res.status(401).json(
            new ApiResponse(401, { isValid: false }, 'Invalid Token')
        );
    }
};
// Refresh access token
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token is required');
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) throw new ApiError(403, 'Invalid refresh token');

            const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

            res.cookie('accessToken', newAccessToken, options)
                .json(new ApiResponse(200, { accessToken: newAccessToken }, 'Access token refreshed'));
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};