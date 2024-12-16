import prisma from "../services/prisma.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { JobStatus } from "@prisma/client";

export const createJob = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  if (!userId) return res.status(401).json({ message: "Not authorized" });
  const {
    title,
    description,
    category,
    budget,
    priority,
    city,
    street,
    pincode,
    landmark,
  } = req.body;
  try {
    if (!title || !description || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const job = await prisma.job.create({
      data: {
        title,
        description,
        category,
        status: JobStatus.OPEN,
        clientId: userId,
        budget,
        priority,
        city,
        street,
        pincode,
        landmark,
      },
    });
    return res.status(201).json({ job });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({
      message: "An error occurred while creating the job.",
      error: err.message,
    });
  }
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ message: "Not authorized" });
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const jobs = await prisma.job.findMany({
      where: {
        clientId: userId,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { client: true },
  });

  if (req.user.role === "CLIENT" && req.user.id !== job.clientId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot access this job" });
  }
  // Allow workers or admins to view any job (optional)
  if (req.user.role === "WORKER" || req.user.role === "ADMIN") {
    return res.status(200).json({ job });
  }
  return res.status(200).json({ job });
});

export const deleteJobById = asyncHandler(async (req, res) => {
  const { id } = req.params || req.body;
  const job = await prisma.job.delete({
    where: {
      id,
    },
  });
  return res.status(200).json({ job });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const jobs = await prisma.job.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});
