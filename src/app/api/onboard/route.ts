import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { telegramId, firstName, lastName } = req.body;

  try {
    await connectToDatabase();

    // Check if the user already exists
    let user = await User.findOne({ telegramId });

    if (!user) {
      // Create a new user
      user = await User.create({
        telegramId,
        firstName,
        lastName,
        walletBalance: 0,
        rewardsBalance: 0,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error onboarding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
