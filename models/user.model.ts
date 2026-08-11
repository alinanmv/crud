import { Schema, model, Document } from "mongoose";
import { UserRole } from "../types";

export interface IUser extends Document {
  username: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  role:{
    type: String,
    enum: ["admin", "user"],
    default: "user",
  }
});

const User = model<IUser>("User", userSchema);

export default User;
