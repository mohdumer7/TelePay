// utils/db.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise()
  }

  return mongoose.connect(process.env.MONGO_URI || "", {

  })
}

export default connectToDatabase
