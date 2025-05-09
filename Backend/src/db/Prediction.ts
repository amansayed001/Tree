import mongoose, { Schema } from "mongoose"


const PredictionSchema = new mongoose.Schema({
    userInput: { type: Object, required: true },
    prediction: { type: Object, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model("Prediction", PredictionSchema)


export default Prediction

