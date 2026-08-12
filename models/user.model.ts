import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  role_id: number;
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
  role_id: {
    type: Number,
    default: 2,
  },
});

const User = model<IUser>("User", userSchema);

export default User;
