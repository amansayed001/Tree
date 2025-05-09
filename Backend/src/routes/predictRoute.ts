import express from "express"
import predictDisease from "../controllers/predictController"
import { lastPredictionInput } from "../controllers/userController"


const router = express.Router()



router.post("/predict", predictDisease)

router.get("/predictionIn/:id", lastPredictionInput)


export default router
