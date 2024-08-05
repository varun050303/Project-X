import asyncHandler from '../middlewares/asyncHandler.js'
import * as userModel from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'

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
    const { name, username, email, password, phoneNumber, role, rating, profilePic } = req.body
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