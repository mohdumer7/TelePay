"use client"

import React from 'react'
import { IconCreditCardPay, IconHome, IconSettings, IconBrandDatabricks } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const Navbar = ({active,setActive}: {active: string,setActive: (active: string) => void}) => {
  const router = useRouter()

  const iconMapper = [
    {
      title: "home",
      icon: IconHome
    },
    {
      title: "transaction",
      icon: IconCreditCardPay
    },
    {
      title: "analytics",
      icon: IconBrandDatabricks
    },
    {
      title: "settings",
      icon: IconSettings
    }
  ]
  const handleClick = (title: string) => {
    setActive(title)
    router.push(`/${title}`)
  }
  console.log(active)
  return (
    <div className='w-full fixed flex justify-around items-center bottom-0 bg-black text-white p-4 border-t border-white/20 rounded-t-xl z-50'>
      {iconMapper.map((item, index) => (
        <item.icon key={index} stroke={2} className={`cursor-pointer ${active === item.title ? "text-white" : "text-white/50"}`} size={30} onClick={() => handleClick(item.title)}/>
      ))}
    </div>
  )
}

export default Navbar