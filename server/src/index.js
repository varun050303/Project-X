import express from 'express'
import userRoutes from './routes/user.routes.js'
import workerRoutes from './routes/worker.routes.js'
import helmet from 'helmet'
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use(helmet())


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))


app.use('/api/users', userRoutes)
app.use('/api/workers', workerRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});