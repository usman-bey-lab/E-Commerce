import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:    [{ 
    productId: Number, 
    name:      String, 
    price:     Number, 
    quantity:  Number,
    image:     String
  }],
  delivery: {
    firstName: String,
    lastName:  String,
    email:     String,
    street:    String,
    city:      String,
    state:     String,
    zip:       String,
    country:   String,
    phone:     String
  },
  totalAmount: Number,
  status:      { type: String, default: "pending" },
  createdAt:   { type: Date, default: Date.now }
})

export default mongoose.model("Order", orderSchema)