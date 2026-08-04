import { Schema, model, Document } from "mongoose";
import { IProduct } from "./product.model";

export interface IUser extends Document {
  username: string;
  password: string;
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
});

const User = model<IUser>("User", userSchema);

export default User;
