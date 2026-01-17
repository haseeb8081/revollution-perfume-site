import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
}, {
  timestamps: true,
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
