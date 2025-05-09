import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import predictRouter from "./routes/predictRoute"
import userRouter from "./routes/userRoute"


// express app
const app = express()

// express middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// api
app.use(predictRouter)
app.use(userRouter)


const port = 3001

mongoose.connect("mongodb://0.0.0.0:27017/tree").then(() => {
    app.listen(port, () => {
        console.log("server started at port 3001")
    })
}).catch((e) => {
    console.log(e)
})
