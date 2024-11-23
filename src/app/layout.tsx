"use client"
import Navbar from "@/components/Navbar";
import "./globals.css"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [active, setActive] = useState("home")
  const router = useRouter()
  useEffect(() => {
    router.push(active)
  }, [])
  return (
    <html className="dark" lang="en">
      <body  className={`antialiased h-[100vh] w-[100vw] relative  bg-black`}>
        <Navbar active={active} setActive={setActive}/>
        {children}
        <ToastContainer />
      </body>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
    </html>
  );
}
