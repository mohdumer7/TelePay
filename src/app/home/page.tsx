'use client'

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { IconBold, IconBolt, IconCreditCard, IconCurrencyDollar, IconDeviceMobile, IconDroplet, IconMoon, IconQrcode, IconSatellite, IconSun, IconTransfer, IconWallet } from '@tabler/icons-react'
import { getTelegramUser } from '@/utils/telegram'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
interface User {
  telegramId: string
  firstName: string
  lastName: string
  walletBalance: number
  rewardsBalance: number
}

const HomePage = () => {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const onboardUser = async () => {
      try {
        // Fetch user data from Telegram
        const telegramUser = getTelegramUser()

        toast.success(`Welcome ${telegramUser.firstName}`, {
          description: telegramUser.username
        } as any)

        // Send Telegram user info to the backend
        const { data } = await axios.post('/api/onboard', telegramUser)

        toast.success(`Welcome ${data}`, {
          description: data.username
        } as any)

        setUser(data) // Store the user info in state
      } catch (error) {
        console.error('Error during user onboarding:', error)
      } finally {
        setIsLoading(false)
      }
    }

    onboardUser()
  }, [])


  const [user, setUser] = useState<User | null>(null)


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.post('/api/onboard', {
          telegramId: '1234567890', // Replace with actual Telegram ID
        })
        setUser(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const loadingSkeleton = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-[#101011] rounded-2xl animate-pulse" />
      ))}
    </motion.div>
  )

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const FeatureButton = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button className={`w-12 h-12 rounded-full ${color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
        <Icon stroke={2} size={28} />
      </Button>
      <span className="mt-2 text-xs max-w-[60px] font-medium text-center  text-gray-400">{label}</span>
    </motion.div>
  )

  const transactions = [
    { id: 1, name: 'Grocery Store', amount: -85.20, date: '2023-06-15' },
    { id: 2, name: 'Salary Deposit', amount: 3500.00, date: '2023-06-14' },
    { id: 3, name: 'Electric Bill', amount: -120.50, date: '2023-06-13' },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-[#101011]`}>
      <div className="flex justify-between items-center mb-6 p-6 rounded-b-3xl shadow-[3px_24px_25px_10px_#0D0C0C] bg-[#181918] w-full  backdrop-blur-md border-white">
      <h1 className="text-2xl font-bold">
          Hello,{' '}
          <span className="text-[#31A4D9]">
            {user ? user.firstName : 'Loading...'}
          </span>
        </h1>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => router.push('/scan-and-pay')}
                    className="w-12 h-12 rounded-xl bg-neutral-700 backdrop-blur-md text-white shadow-2xl hover:bg-white/20 transition-all duration-300"
                  >
                    <IconQrcode stroke={1.5} size={40} />
                  </Button>
                  
                </div>
              </div>

      <div className="max-w-md mx-auto space-y-6 p-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-white" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-[#181918] backdrop-blur-md border-white/5 shadow-[3px_24px_25px_10px_#0D0C0C] rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <CardTitle className="text-lg font-semibold text-white">Wallet Balance</CardTitle>
                    <IconCurrencyDollar className="text-[#31A4D9]" stroke={1.5} size={24} />
                  </div>
                  <motion.p
                    className="text-5xl font-bold text-white font-mono"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    ${user ? user.walletBalance : '0.00'}
                  </motion.p>
                </CardContent>
              </Card>

              <Card className="mt-6 bg-[#181918] border-white/5 shadow-[3px_24px_25px_10px_#0D0C0C] backdrop-blur-md rounded-2xl">
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-semibold text-white">Rewards Balance</CardTitle>
                  <motion.p
                    className="text-3xl font-bold text-[#31A4D9] font-mono mt-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    {user ? user.rewardsBalance : '0'} Coins
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-[#101011] rounded-2xl animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              
              <Card className="mt-6 bg-[#181918] border-white/5 shadow-[3px_24px_25px_10px_#0D0C0C] backdrop-blur-md  rounded-2xl">
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-semibold mb-4 text-white">Quick Actions</CardTitle>
                  <div className="flex gap-4 justify-between">
                    <FeatureButton icon={IconWallet} label="Recharge Wallet" color="bg-gradient-to-br break-all from-cyan-400 to-cyan-600" />
                    <FeatureButton icon={IconTransfer} label="Transfer" color="bg-gradient-to-br from-blue-400 to-blue-600" />
                    <FeatureButton icon={IconCreditCard} label="Cards" color="bg-gradient-to-br from-fuchsia-400 to-fuchsia-600" />
                    <FeatureButton icon={IconCurrencyDollar} label="Payments" color="bg-gradient-to-br from-yellow-400 to-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-6 bg-[#181918] border-[#31A4D9] border-2 shadow-[3px_24px_25px_10px_#0D0C0C] backdrop-blur-md  rounded-2xl">
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-semibold mt-1 text-white">Verification</CardTitle>
                  <CardDescription>
                    Please verify through KYC to use our services
                  </CardDescription>
                    <Button onClick={() => router.push('/verify')} className='w-full  bg-[#31A4D9] mt-8 text-white font-extrabold'>
                      Verify Now
                    </Button>
                </CardContent>
              </Card>

              <Card className="mt-6 bg-[#181918] border-white/5 shadow-[3px_24px_25px_10px_#0D0C0C] backdrop-blur-md  rounded-2xl">
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-semibold mb-4 text-white">Bills and Payments</CardTitle>
                  <div className="flex gap-4 justify-between">
                    <FeatureButton icon={IconDeviceMobile} label="Mobile Recharge" color="bg-gradient-to-br break-all from-rose-400 to-rose-600" />
                    <FeatureButton icon={IconBolt} label="Electricity" color="bg-gradient-to-br from-green-400 to-green-600" />
                    <FeatureButton icon={IconDroplet} label="Water" color="bg-gradient-to-br from-sky-400 to-sky-600" />
                    <FeatureButton icon={IconSatellite} label="DTH" color="bg-gradient-to-br from-neutral-400 to-neutral-600" />
                  </div>
                </CardContent>
              </Card>

              
              
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default HomePage