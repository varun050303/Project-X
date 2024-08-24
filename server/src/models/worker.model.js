import pool from "../config/db.js";

export const getWorkers = async () => {
    const data = await pool.query('SELECT * FROM workers')
    return data.rows
}

export const getWorkerById = async (id) => {
    const data = await pool.query('SELECT * FROM workers WHERE id = $1', [id])
    return data.rows[0]
}

export const createWorker = async () => {
    const data = await pool.query('INSERT INTO workers(user_id,skills,experience_years,hourly_rate) VALUES ($1,$2,$3,$4)', [userId, skills, experienceYears, hourlyRate])
    return data.rows[0]
}

export const deleteWorker = async (id) => {
    const data = await pool.query('DELETE FROM workers WHERE id = $1', [id])
    return data.rows[0]
}