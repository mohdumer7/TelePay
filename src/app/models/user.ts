import mongoose from "mongoose";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  telegramUsername: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  sumsubId: {
    type: String,
  },
  verified: {
    type: Boolean,
  },
  externalUserId: {
    type: String,
  },
  telegramId: {
    type: String,
  },
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    const generateExternalUserId = async (telegramId: string) => {
        const hash = crypto.createHash('sha256');
        hash.update(telegramId);
        const externalUserId = hash.digest('hex');
        return externalUserId;
    }
    this.externalUserId = await generateExternalUserId(this.telegramId);
    next();
}); 

const User = mongoose.model('User', userSchema);

export default User;