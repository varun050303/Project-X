import express, { query } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import queryString from 'query-string';
import axios from 'axios';


const options = {
    httpOnly: true,
    sameSite: 'Strict'
};

const redirect_uri = process.env.GOOGLE_REDIRECT_URI
const server_root_uri = process.env.SERVER_ROOT_URI
const client_root_uri = process.env.CLIENT_ROOT_URI

export const getTokens = async ({
    code,
    clientId,
    clientSecret,
    redirectUri,
}) => {
    const url = process.env.GOOGLE_ACCESS_TOKEN_URL
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
    }

    return axios.post(url, queryString.stringify(values), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    )
        .then(
            (response) => response.data
        )
        .catch(
            (error) => {
                throw new Error(error.message);
            }
        )
}

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

export const getGoogleAuthUrl = (req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${server_root_uri}/${redirect_uri}`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ].join(' '),
    }

    const url = `${rootUrl}?${queryString.stringify(options)}`;
    res.status(200).json({ url });
}

export const getGoogleUserToken = async (req, res) => {

    const { code } = req.query;
    const { id_token, access_token } = await getTokens({
        code,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${server_root_uri}/${redirect_uri}`,
    })

    const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        }).then(
            (response) => response.data
        ).catch(
            (error) => {
                throw new Error(error.message);
            }
        )

    const token = jwt.sign(googleUser, process.env.ACCESS_TOKEN_SECRET);

    res.cookie(process.env.AUTH_COOKIE_NAME, token, {
        maxAge: 900000,
        httpOnly: true,
        secure: false
    })

    res.redirect(server_root_uri);
}


export const getCurrentUser = async (req, res) => {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
        throw new ApiError(401, 'Access token is required');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) throw new ApiError(403, 'Invalid access token');
        res.json(user);
    });
}

