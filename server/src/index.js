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
    origin: process.env.CLIENT_ROOT,
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" ? true : false } // For development; set secure: true in production
}));

app.use('/api/users', userRoutes)
app.use('/api/workers', workerRoutes)
app.use('/auth', authRoutes)
app.get('/ok', (_, res) => {
    res.send('Hie')
})


app.listen(3000, () => {
    console.log(`Server running on port ${port}`);
});