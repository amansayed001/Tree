import mongoose, { Schema, Document, Types } from "mongoose"

export interface IUser extends Document {
  firstName: string
  lastName: string
  motherId?: Types.ObjectId
  fatherId?: Types.ObjectId
  childrenIds: Types.ObjectId[]
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  motherId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  fatherId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  childrenIds: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, {
  timestamps: true
})


const User = mongoose.model<IUser>("User", UserSchema)

export default User
