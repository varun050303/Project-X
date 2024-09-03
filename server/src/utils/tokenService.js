import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
};