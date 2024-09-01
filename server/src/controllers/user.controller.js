import asyncHandler from '../middlewares/asyncHandler.js'
import * as userModel from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const options = {
    httpOnly: true,
    secure: true
};


export const getUsers = asyncHandler(async (req, res) => {
    const users = await userModel.getUsers()
    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    )
})

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await userModel.getUserById(id)
    if (!user) {
        throw new ApiError(404, 'User not found'); // This error will be caught by asyncHandler and passed to errorHandler
    }

    return res.status(201).json(
        new ApiResponse(201, user, "User fetched successfully")
    )
})


export const createUser = asyncHandler(async (req, res) => {

    const newUser = await userModel.createUser({ name, username, email, password, phoneNumber, role, rating, profilePic })
    return res.status(201).json(
        new ApiResponse(201, newUser, "User successfully created")
    )
})

export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const user = await userModel.deleteUser(userId)
    return res.status(201).json(
        new ApiResponse(201, user, "User deleted successfully")
    )
})

export const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, phoneNumber, role, rating, profilePic } = req.body

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        throw new ApiError(409, "User with the same email or username already exists");
    }

    const newUser = await userModel.createUser({ name, username, email, password, phoneNumber, role, rating, profilePic })
    const { accessToken, refreshToken } = await userModel.generateTokens(newUser.id);

    res.status(201).json(new ApiResponse(201, { user: newUser, accessToken, refreshToken }, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.getUserByEmail(email);
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await userModel.generateTokens(user.id);

    res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user }, "User logged in successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    const user = await userModel.logoutUser(userId)

    res.status(200).json(new ApiResponse(200, user, "User logged out successfully"));
});

export const getCurrentUser = async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
        throw new ApiError(401, 'Access token is required');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) throw new ApiError(403, 'Invalid access token');
        res.json(user);
    });
}
