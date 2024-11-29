import asyncHandler from "../middlewares/asyncHandler.js";
import prisma from "../services/prisma.service.js";

export const getWorkers = asyncHandler(async (req, res, _) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const workers = await prisma.user.findMany({
      where: { role: "WORKER" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return res.status(200).json({ workers });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return res.status(500).json({ error: "Failed to fetch workers" });
  }
});
