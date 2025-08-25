import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true // read express docs
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'


// routes decleration
// app.use("/users", userRouter)
// so now this users has become prefix for our url such as
// https://localhost:8000/users/ now here controll will go to userRouter
// but in standard practice we write as:
app.use("/api/v1/users", userRouter)
// now the url has become https://localhost:8000/api/v1/users/(here will be register or login .....)

export { app }