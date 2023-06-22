import express,{ Application } from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import cors from 'cors'
import dbConnection from './config/dbConnection';
import userRoutes from './router/userRoutes'
dotenv.config()

const app  :Application = express();
const PORT :Number = Number(process.env.PORT) || 4002
const DATABASE_URL = process.env.DATABASE_URL as string

// Database configuration
(
    async () => {
        await dbConnection(DATABASE_URL)
    }
)();

// Middleware configurations]
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/',userRoutes)

// Server configuration
const server :Server = app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})