import pool from "../config/db";

export const getUsers = async () => {
    const data = await pool.query('SELECT * FROM users')
    return data.rows
}

export const getUserById = async (id) => {
    const data = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return data.rows[0]
}