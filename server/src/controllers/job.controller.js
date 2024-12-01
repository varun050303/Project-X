import prisma from "../services/prisma.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { JobStatus } from "@prisma/client";

export const createJob = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  if (!userId) return res.status(401).json({ message: "Not authorized" });
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const job = await prisma.job.create({
      data: {
        title,
        description,
        category,
        status: JobStatus.PENDING,
        clientId: userId,
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

export const getJobs = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ message: "Not authorized" });
  const jobs = await prisma.job.findMany({
    where: {
      clientId: userId,
    },
  });
  return res.status(200).json({ jobs });
});
