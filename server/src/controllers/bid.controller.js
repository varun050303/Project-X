import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import DOMPurify from "isomorphic-dompurify";
import prisma from "../services/prisma.service.js";
import { BidStatus } from "@prisma/client";

export const createBid = asyncHandler(async (req, res) => {
  const { jobId, amount, message } = req.body;
  const { id: userId } = req.user;

  const sanitizedJobId = DOMPurify.sanitize(jobId);
  const sanitizedMessage = DOMPurify.sanitize(message);

  const sanitizedAmount = DOMPurify.sanitize(String(amount));
  const parsedAmount = parseFloat(sanitizedAmount);

  // Validate that parsedAmount is a valid number
  if (isNaN(parsedAmount)) {
    throw new ApiError(400, "Invalid bid amount");
  }

  const worker = await prisma.worker.findUnique({
    where: { userId },
  });

  if (!worker) {
    return ApiError(403, "Only workers can place bid");
  }

  const job = await prisma.job.findUnique({
    where: { id: sanitizedJobId },
  });

  if (!job) {
    return ApiError(404, "Job not found");
  }

  const existingBid = await prisma.bid.findFirst({
    where: {
      jobId,
      workerId: worker.id,
    },
  });

  if (existingBid) {
    return ApiError(400, "You have already placed a bid on job on this job");
  }

  const bid = await prisma.bid.create({
    data: {
      message: sanitizedMessage,
      amount: parsedAmount,
      jobId: sanitizedJobId,
      workerId: worker.id,
    },
  });

  return res.status(200).json({ bid });
});

export const hasWorkerPlacedBid = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  const { id: userId } = req.user;

  const sanitizedJobId = DOMPurify.sanitize(jobId);

  const worker = await prisma.worker.findUnique({
    where: { userId },
  });

  if (!worker) {
    return new ApiError(403, "Only worker can place bid");
  }

  const workerBid = await prisma.bid.findFirst({
    where: {
      workerId: worker.id,
      jobId: sanitizedJobId,
    },
  });

  if (!workerBid) {
    return res.status(200).json({ hasBid: false });
  }

  return res.status(200).json({ hasBid: true });
});

export const getAllBids = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;

  const sanitizedJobId = DOMPurify.sanitize(jobId);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const bids = await prisma.bid.findMany({
    where: { jobId: sanitizedJobId },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      Worker: {
        include: {
          id: false,
          userId: false,
          user: {
            select: {
              name: true,
              profilePic: true,
            },
          },
        },
      },
    },
  });

  return res.status(200).json({ bids });
});

export const handleBidAcceptance = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { jobId, workerId, action } = req.query;

  const sanitizedJobId = DOMPurify.sanitize(jobId);
  const sanitizedWorkerId = DOMPurify.sanitize(workerId);
  const sanitizedAction = DOMPurify.sanitize(action);

  const transaction = [
    updateBidStatus(sanitizedAction, sanitizedJobId, sanitizedWorkerId),
  ];
  if (sanitizedAction === BidStatus.ACCEPTED) {
    transaction.push(
      createBookingForAcceptenceBid(userId, sanitizedJobId, sanitizedWorkerId)
    );
  }
  await prisma.$transaction(transaction);

  return res
    .status(200)
    .json({ message: "Bid accepted and booking created successfully." });
});

const updateBidStatus = asyncHandler(async (action, jobId, workerId) => {
  if (action === BidStatus.ACCEPTED) {
    await prisma.$transaction([
      prisma.bid.updateMany({
        where: {
          jobId,
          NOT: { workerId },
        },
        data: { status: BidStatus.REJECTED },
      }),

      prisma.bid.updateMany({
        where: {
          jobId,
          workerId,
        },
        data: { status: BidStatus.ACCEPTED },
      }),
    ]);
  } else if (sanitizedAction === BidStatus.REJECTED) {
    await prisma.bid.updateMany({
      where: {
        jobId,
        workerId,
      },
      data: { status: BidStatus.REJECTED },
    });
  } else {
    return new ApiError(400, "Invalid action");
  }
});

const createBookingForAcceptenceBid = asyncHandler(
  async (userId, jobId, workerId) => {
    await prisma.booking.create({
      data: {
        jobId,
        workerId,
        clientId: userId,
      },
    });
  }
);
