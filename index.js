import express from "express"
import dotenv from "dotenv"
import connectToDB from "./config/db.js"
import authRouter from './routes/authRoutes.js'
import http from 'http'

dotenv.config()
connectToDB().then(() => { return })

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 6969

const server = http.createServer(app)

app.use('/api/auth', authRouter)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
