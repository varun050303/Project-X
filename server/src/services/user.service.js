// import pool from "../config/db.js";

// export const findOrCreateUser = async (user, role = "user") => {
//   const existingUser = await pool.query(`SELECT * FROM User WHERE email = $1`, [
//     user.email,
//   ]);
//   if (existingUser.rows.length === 0) {
//     const newUser = await pool.query(
//       `INSERT INTO User (name, email, profilePic, role, age, gender, refreshToken) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *`,
//       [
//         user.name,
//         user.email,
//         user.picture,
//         role,
//         user.age,
//         user.gender,
//         user.refresh_token,
//       ]
//     );
//     return newUser.rows[0];
//   }
//   return existingUser.rows[0];
// };

import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";

const prisma = new PrismaClient();

const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

const findWorkerByUserId = async (userId) => {
  const worker = await prisma.worker.findUnique({
    where: {
      userId: userId, // Find worker by userId (since worker is linked to user)
    },
  });

  return worker;
};

const createUser = async (user, tx) => {
  const newUser = await tx.user.create({
    data: {
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      refreshToken: user.refresh_token,
      status: "ACTIVE",
      role: user.role,
    },
  });

  if (user.role === "WORKER") {
    const existingWorker = await findWorkerByUserId(newUser.id);
    if (!existingWorker) {
      await tx.worker.create({
        data: {
          userId: newUser.id, // Link the worker to the user
        },
      });
    }
  }

  return newUser;
};

export const findOrCreateUser = async (user) => {
  const transaction = await prisma.$transaction(async (tx) => {
    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
      return existingUser;
    }
    const newUser = await createUser(user, tx);
    return newUser;
  });
  return transaction;
};

const validRoles = ["CLIENT", "WORKER"];

export const validateRole = (role) => {
  if (!validRoles.includes(role)) {
    throw new ApiError(400, `Invalid role: ${role}`);
  }
};
