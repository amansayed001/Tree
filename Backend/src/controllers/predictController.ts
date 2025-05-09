import { Request, Response } from "express";
import { predictFromModel } from "../services/predictService";
import Prediction from "../db/Prediction";


const requiredFields = [
    "age", "gender", "pregnancies", "glucose", "blood_pressure",
    "skin_thickness", "insulin", "bmi", "diabetes_pedigree_function",
    "cholesterol", "resting_bp", "chest_pain_type", "fasting_blood_sugar",
    "rest_ecg", "max_heart_rate", "exercise_induced_angina",
    "oldpeak", "slope", "num_major_vessels", "thal", "userId"
]

const predictDisease = async (req: Request, res: Response) => {
    try {
        const userInput = req.body

        // check for missing required fields
        if (!userInput || typeof userInput !== 'object') {
            res.status(400).json({ error: "Invalid input. Please send a JSON body." });
            return
        }

        const missingFields = requiredFields.filter(field => !(field in userInput))

        if (missingFields.length > 0) {
            res.status(400).json({
              error: "Missing required fields",
              missingFields: missingFields
            })

            return
        }

        const prediction = await predictFromModel(userInput)
    
        const savedPrediction = await Prediction.create({
          userInput,
          prediction,
          userId: req.body.userId,
          createdAt: new Date()
        });
    
        res.json(savedPrediction)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong during prediction." })
    }
}



export default predictDisease
