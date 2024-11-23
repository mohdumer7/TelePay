"use client"
import React, { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner';
import { IconArrowLeft, IconBolt,IconBoltFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const ScanAndPayPage  = () => {
  const router = useRouter();

  const handleScan = (result:any) => {
    const url = result[0].rawValue;
    if(url.startsWith("upi://pay")){
      router.push(`/scan-and-pay/peerPay?payUrl=${url}`)
    }
  }
  // "upi://pay?pa=8590113060@okbizaxis&pn=ADON%20LAND%20VENTURES&mc=7011&aid=uGICAgIDnpo2QYQ&tr=BCR2DN6T36GK7PS2"
    return (
    <div className='w-full h-full bg-[#2a2a2a]  justify-center items-center text-white'>
      <div className=' flex flex-col w-full h-full gap-8 '>
        <div className='w-full flex  bg-[#24A1DE] p-4 rounded-b-xl'>
          <IconArrowLeft stroke={2} width={30} height={30} onClick={() => router.back()} className='cursor-pointer' />
            <p className='text-xl w-full text-center font-bold'>Scan And Pay</p>
            
        </div>
        <div className='flex justify-center items-center mt-10 relative'>
        <Scanner components={{
            torch:true
          }}
           classNames={{
          video: 'rounded-xl h-full',
          container: 'rounded-xl h-full'
        }} onScan={handleScan} />
        </div>
        <div className='w-full flex justify-center items-center'>
          <div className='w-full h-10  rounded-xl flex justify-center items-center'>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanAndPayPage
