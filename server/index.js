import express from 'express'
import userRoutes from './routes/user.routes.js'
import workerRoutes from './routes/worker.routes.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes)
app.use('/api/workers', workerRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});