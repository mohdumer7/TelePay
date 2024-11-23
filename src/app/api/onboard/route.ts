import { NextResponse } from 'next/server'
import connectToDatabase from '@/utils/db'
import User from '@/models/User'

// POST handler for onboarding
export async function POST(req: Request) {
  try {
    // Parse the request body
    const { telegramId, firstName, lastName, username } = await req.json()

    // Connect to MongoDB
    await connectToDatabase()

    // Find or create the user
    let user = await User.findOne({ telegramId })
    if (!user) {
      user = await User.create({
        telegramId,
        firstName,
        lastName,
        username,
        walletBalance: 0,
        rewardsBalance: 0,
      })
    }

    // Return the user as JSON
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in onboarding:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
