import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Admin", adminSchema)