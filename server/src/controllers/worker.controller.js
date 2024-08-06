import asyncHandler from '../middlewares/asyncHandler.js'
import * as workerModel from '../models/worker.model.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'

export const getWorkers = asyncHandler(async (req, res) => {
    const workers = await workerModel.getWorkers()
    return res.status(200).json(
        new ApiResponse(200, workers, "Data fetched successfully")
    )
})

export const getWorkerById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const worker = await workerModel.getWorkerById(id)
    if (!worker) {
        throw new ApiError(404, 'Worker not found'); // This error will be caught by asyncHandler and passed to errorHandler
    }

    return res.status(201).json(
        new ApiResponse(201, user, "Data fetched successfully")
    )
})

export const createWorker = asyncHandler(async (req, res) => {
    const { userId, experienceYears, skills, hourlyRate } = req.body

    const newWorker = workerModel.createWorker({ userId, experienceYears, skills, hourlyRate })
    if (!newWorker) {
        throw new ApiError(500, 'Some error occoured');
    }

    return res.status(201).json(
        new ApiResponse(201, newWorker, 'Worker created successfully')
    )
})

export const deleteWorker = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const worker = await workerModel.deleteWorker(userId)
    return res.status(201).json(
        new ApiResponse(201, worker, "Worker deleted successfully")
    )
})