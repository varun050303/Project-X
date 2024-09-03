import jwt, { decode } from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

const options = {
    httpOnly: true,
    sameSite: 'Strict'
};

const authCookieName = process.env.AUTH_COOKIE_NAME


export const verifyToken = (req, res) => {
    const token = req.cookies.authCookieName; // Retrieve the token from the HTTP-only cookie
    console.log(token)
    if (!token) {
        throw new ApiError(401, 'Token not provided', { isValid: false });// Unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        res.status(200).json(
            new ApiResponse(200, { isValid: true, user: decoded }, 'Token is valid')
        )
    } catch (error) {
        throw new ApiError(401, 'Invalid Token', { isValid: false });
    }
}

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