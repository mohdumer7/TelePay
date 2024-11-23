// utils/db.js
import mongoose from 'mongoose'

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise()
  }

  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

export default connectToDatabase
