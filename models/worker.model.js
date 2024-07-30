import pool from "../config/db";

export const getWorkers = async () => {
    const data = await pool.query('SELECT * FROM workers')
    return data.rows
}

export const getWorkerById = async (id) => {
    const data = await pool.query('SELECT * FROM workers WHERE id = $1', [id])
    return data.rows[0]
}
