import express from "express"
import { createUser, deleteUser, getAllPatients, getUser, updateUser } from "../controllers/userController"


const router = express.Router()



router.post("/user/create", createUser)

router.patch("/user/:id", updateUser)

router.delete("/user/delete/:id", deleteUser)

router.get("/user/:id", getUser);

router.get("/users", getAllPatients);


export default router

