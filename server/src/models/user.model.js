import pool from "../config/db";
import jwt from 'jsonwebtoken';

export const getUsers = async () => {
    const data = await pool.query('SELECT * FROM users')
    return data.rows
}

export const getUserById = async (id) => {
    const data = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return data.rows[0]
}


export const deleteUser = async (userId) => {
    const data = pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId])
    return data.rows[0]
}

export const createUser = async ({ name, username, email, password, phoneNumber, role, rating, profilePic }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await pool.query(
        'INSERT INTO users (name, username, email, password, phone_number, role, rating, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [name, username, email, hashedPassword, phoneNumber, role, rating, profilePic]
    );
    return data.rows[0];
};

export const getUserByEmail = async (email) => {
    const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return data.rows[0];
};

// Generate JWT Tokens
export const generateTokens = async (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, userId]);

    return { accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
    const data = await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1 RETURNING *', [userId]);
    return data.rows[0]
}