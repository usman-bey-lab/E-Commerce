import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import Admin from './models/Admin.js'

dotenv.config()

await mongoose.connect(process.env.MONGODB_URI)

const password = await bcrypt.hash('admin123', 12)
await Admin.deleteMany({})
await Admin.create({
  name:     'Admin',
  email:    'admin@shopper.com',
  password: password,
  role:     'superadmin'
})

console.log('✅ Admin account created!')
console.log('Email:    admin@shopper.com')
console.log('Password: admin123')

await mongoose.disconnect()
process.exit()