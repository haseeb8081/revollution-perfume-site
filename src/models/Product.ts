import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: "women" | "men" | "unisex";
  notes: {
    top: string;
    middle: string;
    base: string;
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  variants: Array<{
    sizeMl: number;
    stockQuantity: number;
    sku: string;
  }>;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["women", "men", "unisex"],
      default: "unisex",
    },
    notes: {
      top: String,
      middle: String,
      base: String,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    variants: [
      {
        sizeMl: Number,
        stockQuantity: Number,
        sku: String,
      },
    ],
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
