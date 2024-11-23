"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'
import { IconArrowLeft } from '@tabler/icons-react'

function PeerPayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PeerPayContent />
    </Suspense>
  )
}

function PeerPayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const payUrl = searchParams.get("payUrl")
  const payeeName = searchParams.get("pn")
  const [payeeVpa,setPayeeVpa] = useState<string | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState<string>("")

  const handlePay = async () => {
    if(amount === ""){
      toast.error("Please enter the amount")
      return
    }
    console.log(payeeVpa,payeeName,amount)
  }
  console.log(payUrl)
 // "upi://pay?pa=8590113060@okbizaxis&pn=ADON%20LAND%20VENTURES&mc=7011&aid=uGICAgIDnpo2QYQ&tr=BCR2DN6T36GK7PS2"
  useEffect(()=>{
    if(payUrl){
      setPaymentUrl(payUrl)
      const urlParams = new URLSearchParams(payUrl.split("?")[1])
      setPayeeVpa(urlParams.get("pa") || "")
      setIsLoading(false)
    }else{
      setIsLoading(true)
    }
  },[payUrl])


  return (
    <div className='w-full h-full bg-[#2a2a2a]  justify-center items-center text-white '>
      {isLoading ? <div className='flex justify-center items-center h-full w-full'>
        <Loader2 className='animate-spin text-white' />
      </div> : <div className=' flex flex-col w-full h-full gap-8 '>
      <div className='w-full flex  bg-[#24A1DE] p-4 rounded-b-xl'>
          <IconArrowLeft stroke={2} width={30} height={30} onClick={() => router.back()} className='cursor-pointer' />
            <p className='text-xl w-full text-center font-bold'>PAY</p>
            
        </div>

        <div className='flex flex-col gap-2 p-4'>
          <Label className='text-sm font-bold '>Payee VPA</Label>
            <Input className='bg-transparent ' value={payeeVpa || ""} disabled />
          <Label className='text-sm font-bold '>Payee Name</Label>
            <Input className='bg-transparent' value={payeeName || ""} disabled />
          <Label className='text-sm font-bold '>Amount</Label>
            <Input className='bg-transparent' type='number' placeholder='Enter the amount' value={amount} onChange={(e)=>setAmount(e.target.value)} />
          <Button onClick={handlePay}>Pay</Button>
        </div>
      </div>}
    </div>
  )
}

export default PeerPayPage