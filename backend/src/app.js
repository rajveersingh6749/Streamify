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
import commentRouter from "./routes/comment.routes.js"
import communityPostRouter from "./routes/communityPost.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"


// routes decleration
// app.use("/users", userRouter)
// so now this users has become prefix for our url such as
// https://localhost:8000/users/ now here controll will go to userRouter
// but in standard practice we write as:
app.use("/api/v1/users", userRouter)
// now the url has become https://localhost:8000/api/v1/users/(here will be register or login .....)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/community-posts", communityPostRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)

export { app }