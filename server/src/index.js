import express from 'express'
import userRoutes from './routes/user.routes.js'
import workerRoutes from './routes/worker.routes.js'
import authRoutes from './routes/auth.routes.js'
import helmet from 'helmet'
import cookieParser from "cookie-parser"
import cors from 'cors'
import session from 'express-session'

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use(helmet())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // For development; set secure: true in production
}));

app.use('/api/users', userRoutes)
app.use('/api/workers', workerRoutes)
app.use('/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});