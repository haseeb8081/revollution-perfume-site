import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IReview extends Document {
  name: string;
  email: string;
  rating: number;
  comment: string;
  product?: string;
  verifiedPurchase: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    default: "anonymous@revollution.com",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  product: {
    type: String,
  },
  verifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpful: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
