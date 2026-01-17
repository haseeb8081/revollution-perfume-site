import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
