import { Request, Response } from "express"
import User from "../db/User"
import Prediction from "../db/Prediction"

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body

    // validate required fields
    if (!firstName || !lastName) {
        res.status(400).json({ error: "firstName and lastName are required" })
        return
    }

    // create new user
    const newUser = new User({
      firstName,
      lastName
    })

    await newUser.save()

    res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong while creating user" })
  }
}


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // ✅ Allowed fields for update
    const allowedUpdates = ["motherId", "fatherId", "childrenIds", "firstName", "lastName"]
    const fieldsToUpdate = Object.keys(updates)

    const isValidOperation = fieldsToUpdate.every(field => allowedUpdates.includes(field))

    if (!isValidOperation) {
      res.status(400).json({ error: "Invalid fields in update" })
      return
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true })

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong while updating user" })
  }
}


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong while deleting user" })
  }
}


export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
      .populate("motherId", "firstName lastName")
      .populate("fatherId", "firstName lastName")
      .populate("childrenIds", "firstName lastName")

    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong while fetching user" })
  }
}


export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "firstName lastName createdAt").sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong while fetching patients" })
  }
}



export const lastPredictionInput = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const preInput = await Prediction.findOne({ userId: id }).sort({ createdAt: -1 }).limit(1)

    if (!preInput) {
      res.status(404).json({ error: "Prediction not found" })
      return
    }

    res.json(preInput)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong while fetching prediction" })
  }
}
