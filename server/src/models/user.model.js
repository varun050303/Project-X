import pool from "../config/db";

export const getUsers = async () => {
    const data = await pool.query('SELECT * FROM users')
    return data.rows
}

export const getUserById = async (id) => {
    const data = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return data.rows[0]
}

export const createUser = async ({ name, username, email, password, phoneNumber, role, rating, profilePic }) => {
    const data = await pool.query('INSERT INTO users(name, username, email, password, phone_number, role, rating, profile_pic) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [name, username, email, password, phoneNumber, role, rating, profilePic])
    return data.rows[0]
}

export const deleteUser = async (userId) => {
    const user = pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId])
}