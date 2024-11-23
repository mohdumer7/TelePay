"use client"
import React, { useState, useEffect } from 'react';
import SumsubWebSdk from '@sumsub/websdk-react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';


const SumsubWidget = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.post('/api/sumsubToken', {
          externalUserId: '1234567890'
        });
        setAccessToken(data.token);
      } catch (error) {
        console.error('Error fetching Sumsub token:', error);
      }
    };

    fetchToken();

    // const fetchStatus = async () => {
    //   const { data } = await axios.get('/api/sumsubToken', {
    //     params: { externalUserId: '1234567890' }
    //   });
    //   console.log('status',data)
    // }

    // fetchStatus()
  }, []);

  if (!accessToken) return <Loader2 className="animate-spin" />;

  return (

    <div className='flex h-full justify-center  w-full p-4'>
      <SumsubWebSdk
        testEnv={true}
        accessToken={accessToken}
        expirationHandler={() => accessToken}
        config={{
          lang: "en-us"
          // email: "test@gmail.com",
          // phone: "0912234456"
        }}
        className='w-full h-full rounded-xl'
        // options={{ addViewportTag: false, adaptIframeHeight: true }}
        onMessage={(data: any, payload: any) => console.log("onMessage", data, payload)}
        onError={(data: any) => console.log("onError", data)}
      />
    </div>
  );
};

export default SumsubWidget;
