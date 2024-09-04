import express from 'express'
import userRoutes from './routes/user.routes.js'
import workerRoutes from './routes/worker.routes.js'
import authRoutes from './routes/auth.routes.js'
import helmet from 'helmet'
import cookieParser from "cookie-parser"
import cors from 'cors'

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use(helmet())

app.use(cors({
    origin: process.env.CLIENT_ROOT,
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))

app.use('/api/users', userRoutes)
app.use('/api/workers', workerRoutes)
app.use('/auth', authRoutes)
app.get('/ok', (_, res) => {
    res.send('Hie')
})


app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});