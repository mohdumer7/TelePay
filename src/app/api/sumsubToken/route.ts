import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import fs from 'fs';
import FormData from 'form-data';


// These parameters should be used for all requests
const SUMSUB_APP_TOKEN = process.env.NEXT_PUBLIC_SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.NEXT_PUBLIC_SUMSUB_SECRET_KEY;
const SUMSUB_BASE_URL = 'https://api.sumsub.com'; 

var config = {
  baseURL: SUMSUB_BASE_URL
};

axios.interceptors.request.use(createSignature, function (error: any) {
  return NextResponse.json({ error: 'Failed to generate Sumsub token' }, { status: 500 })
})

function createSignature(config: any) {
  console.log('Creating a signature for the request...');

  var ts = Math.floor(Date.now() / 1000);
  if (!SUMSUB_SECRET_KEY) {
    throw new Error('SUMSUB_SECRET_KEY must be provided!');
  }
  const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');

  return config;
}

// These functions configure requests for specified method

// https://docs.sumsub.com/reference/create-applicant
function createApplicant(externalUserId: any, levelName: any) {
  console.log("Creating an applicant...");

  var method = 'post';
  var url = '/resources/applicants?levelName=' + encodeURIComponent(levelName);
  var ts = Math.floor(Date.now() / 1000);
  
  var body = {
      externalUserId: externalUserId
  };

  var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-App-Token': SUMSUB_APP_TOKEN
  };

  return {
    method: method,
    url: url,
    headers: headers,
    data: JSON.stringify(body)
  };
}

function getApplicantId(externalUserId: any) {
  const method = 'get';
  const url = `/resources/applicants?externalUserId=${externalUserId}`;

  const headers = {
    'Accept': 'application/json',
    'X-App-Token': SUMSUB_APP_TOKEN
  };

  return {
    method: method,
    url: url,
    headers: headers,
    data: null
  };
}

function getApplicantInfo(externalUserId: any) {
  const method = 'GET';
  const url = `https://api.sumsub.com/resources/applicants/-;externalUserId=${externalUserId}/one`;
  const headers = {
    'Accept': 'application/json',
    'X-App-Token': SUMSUB_APP_TOKEN
  };

  return {
    method: method,
    url: url,
    headers: headers,
    data: null
  };
}

// https://docs.sumsub.com/reference/add-id-documents
function addDocument(applicantId: any) {
  console.log("Adding document to the applicant...");

  var method = 'post';
  var url = `/resources/applicants/${applicantId}/info/idDoc`;
  var filePath = 'resources/sumsub-logo.png';

  var metadata = {
      idDocType: 'PASSPORT',
      country: 'GBR'
  };

  var form = new FormData();
  form.append('metadata', JSON.stringify(metadata));
  
  var content = fs.readFileSync(filePath); 
  form.append('content', content, filePath);
  
  /*
  In case you'd like to upload images in base64 encoded string format:
  
  var content = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABCUExURUxpcSMudAGjmiIwdiEtdSIwdCMxdSMwdSMwdQGmlyMvdSFPfQOnmCMvdSMwdSMwdQGjmiMwdQGjmgGjmiMwdQGjmlncPbUAAAAUdFJOUwAw5lQRH0PM8CGpBhC81eBrftK5jzDo3gAAAAlwSFlzAAABwAAAAcABl8K+3QAAAuRJREFUeNrtm9typCAURXFEdMRLm6T//1fnId4qfUKDomLNWo8pwLOq7WwP0koBAAAAAAAAAAD8xzz+BPJIq377DMbeXaBBAAEEEIhHc3eBR7hAEkn2+Bhz9bmBcerH41Z3flqZ3MQRaBBAAAEEEEAAAQQQQAABBO7QCV/YHc/978IzEi8LH9EnN89Tid8n/z1XoEEAAQQQuPTf6AHp/Hlm/Z8BhQ1d/4PSyDfRiYgFmLb8yaBU8fVKqZKkFUotVCb8tU9ToBNKzRBAAAEEEhQY0hQY3gkMWfGNSpSxvGyQBXp1G3pRoLuPQIcAAgggcCnlSsCWieevM5M7q5Qd802vBuSv3aeT1vjNXY8zodfIVwVmI7/sAeuvUFa3X+UaV0lp6ov2f+YIXnspzLoHeoqKFAgggAACCCQhUJvvGDRtHIF2Wq8+SWDO7yyOwFyYrU4RqIRHjl0C2vO2QgABBBDYL2CFYm10AXEjW+qq5n66XjpFt8DSF86p1Xqmc8imgzbf5J1bwI7jjJ074XdPCN3U4S5z3QJdPo7TagOZW0B5Zqi0itSPV+IbgF078p4C4dsAYote7bvzEUAAAQR2CvTRBaRMroVhebhALixT78tfVyavsK870Z3QMUuY9ZmldiQXkn1BqwMR89d5Re2byeegPb8hK/ZtmyOAAAII7BWokheo3VPqVAXm/H2XfUImJyFgd8xNQaAKn4wAAggggICJI5CfXnc9drNVHIGpO67NOfVLnfA+gZO74w3PoGk9WCOAAAIIXNsdb+iEJdojBUw9UrgF2vx1x9o7D6d30W+642KqJSCn9fzxlid0s2/Wm/2qLWen+9jPoO5vg1Rit+uwBwIIIIDAFQK293snHF3A+e64D0hLnY/YOZMXquMEqterGTvVsik1te9vkuIIxO+Tfc8vHidwwGEPBBBAAIHzBKzzN6d1HIE21olpZyZLRNqLta5rXPfyAAAAAAAAAAAAAH7nHygtt70j9IRfAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC'
  var ext = content.substring("data:image/".length, content.indexOf(";base64"));
  var fileName = `image.${ext}`;
  var base64Data = content.split(',')[1];
  form.append('content', Buffer.from(base64Data, 'base64'), { fileName });
  */

  var headers = {
    'Accept': 'application/json',
    'X-App-Token': SUMSUB_APP_TOKEN
  };

  return {
    method: method,
    url: url,
    headers: Object.assign(headers, form.getHeaders()),
    data: form
  };
}

// https://docs.sumsub.com/reference/get-applicant-review-status
function getApplicantStatus(applicantId: any) {
  console.log("Getting the applicant status...");

  var method = 'get';
  var url = `/resources/applicants/${applicantId}/status`;

  var headers = {
    'Accept': 'application/json',
    'X-App-Token': SUMSUB_APP_TOKEN
  };

  return {
    method: method,
    url: url,
    headers: headers,
    data: null
  };
}

// https://docs.sumsub.com/reference/generate-access-token-query
function createAccessToken (externalUserId: any, levelName: any = 'basic-kyc-level', ttlInSecs: any = 600) {
  console.log("Creating an access token for initializng SDK...");

  var method = 'post';
  var url = '/resources/accessTokens?userId=' + encodeURIComponent(externalUserId) + '&ttlInSecs=' + ttlInSecs + '&levelName=' + encodeURIComponent(levelName);

  var headers = {
      'Accept': 'application/json',
      'X-App-Token': SUMSUB_APP_TOKEN
  };

  return {
    method: method,
    url: url,
    headers: headers,
    data: null
  };
}

export async function GET(request: NextRequest) {
 try{ 
    const {searchParams} = new URL(request.url)
    const externalUserId = searchParams.get('externalUserId')
    if(!externalUserId){
        return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
            'Content-Type': 'application/json',
        },
        });
    }
    console.log('externalUserId',externalUserId)
    // const applicantId = await axios(getApplicantId(externalUserId))
    const token = await axios(createAccessToken(externalUserId,'basic-kyc-level',1200))
    const options = {
        method: 'GET',
        url: `https://api.sumsub.com/resources/applicants/-;externalUserId=${externalUserId}/one`,
        headers: {
          accept: 'application/json',
          'X-App-Token': SUMSUB_APP_TOKEN,
          'X-App-Access-Ts': token.data.ts,
          'X-App-Access-Sig': token.data.sig
        }
      };
      
      
    const response = await axios.request(options)
    console.log(response.data)

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(error.response);
    return new NextResponse(JSON.stringify({ error: 'Failed to get application status' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Creating Sumsub token...')
    const {externalUserId} = await request.json()
    if(!externalUserId) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const levelName = process.env.NEXT_PUBLIC_SUMSUB_LEVEL_NAME || 'basic-kyc-level'

    const response = await axios(createAccessToken(externalUserId, levelName, 1200))
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(error.response.data);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate Sumsub token' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

