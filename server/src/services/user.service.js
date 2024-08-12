import pool from "../config/db.js";

export const findOrCreateUser = async (user, role = "user") => {
    const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [user.email]);
    if (existingUser.rows.length === 0) {
        const newUser = await pool.query(`INSERT INTO users (name,email,profile_pic,password,role,age,gender) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [user.name, user.email, user.picture, null, role, user.age, user.gender]);
        return newUser.rows[0];
    }
    return existingUser.rows[0];
};