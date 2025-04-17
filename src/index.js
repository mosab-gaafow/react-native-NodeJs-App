import express from 'express';
import dotenv from 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/booksRoutes.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT, () => {
    console.log('Server is running on port 4000');
    connectDB();
});

