import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", 
        required: true,
      },
    ],
    references: {
      type: String, 
    },
    totalPrice: {
      type: Number, 
      required: true,
    },
    orderDate: {
      type: Date, 
      default: Date.now, 
    },
    status: {
      type: String, 
      enum: ["pending", "completed", "cancelled"], 
      default: "pending",
    },
  },
  { timestamps: true } 
);


export default mongoose.model("Order",OrderSchema)
