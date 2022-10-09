import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'

import { KJUR } from 'jsrsasign';
import {Buffer} from 'buffer';
import jwt_decode from "jwt-decode";
import { ZoomMtg } from '@zoomus/websdk'
import './Zoom.css'
import { meetingLength, redirectUrl } from '../env';
export default function Zoom({meeting_password,meeting_id,signature, email, username}) {

let apiKey = 'ZLDSZm0QR6CJOXdY_VZy7g'
let apiSecret = 'yrHRncbUhgW1iH2vyhrYTmyqLm0WvrQhBhnF'
let sdkKey = 'SuBCj7EVVYTEoxZtCi6nQAN4PjB57v8fN3AY'
let sdkSecret = 'RHPHDNVwJrDGDREDnynKPW5F1uRgnzUE96B1'
let leaveUrl = 'http://localhost:3000/exited'
let meetingNumber =  77669282631
let userName = ''
let userEmail = email

let role = 1 //role 1 is for admin


// function generateSignature(apiKey, apiSecret, meetingNumber, role) {
//     return new Promise((res,rej) => {
//         // Prevent time sync issue between client signature generation and Zoom
//         console.log('inside gen Sig',{apiKey, apiSecret, meetingNumber, role})
//         const timestamp = new Date().getTime() - 30000
//         const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')

//         // const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
//         var hash = CryptoJS.HmacSHA256(msg, apiSecret);
//         var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
//         const signature = Buffer.from(apiKey, meetingNumber, timestamp, role, hashInBase64).toString('base64')
//         console.log({signature,hash, hashInBase64,msg},"dsd")
//         return res(signature)
//     })
    
// }
//create meeting api
function generateSignature(sdkKey, sdkSecret, meetingNumber, role) {

    const iat = Math.round((new Date().getTime() - 30000) / 1000)
    const exp = iat + 120
    const oHeader = { alg: 'HS256', typ: 'JWT' }
  
    const oPayload = {
      sdkKey: sdkKey,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      appKey: sdkKey,
      tokenExp: iat + 120
    }
  
    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret)
    console.log(sdkJWT)
    return sdkJWT
  }

const [start, setStart] = useState(null)
useEffect(()=>{
    showZoomDiv()
    signature =  generateSignature(sdkKey, sdkSecret, meeting_id, role)
    console.log({signature})

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.7.0/lib','/av')
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareWebSDK()
    initializeMeeting()
    var decoded = jwt_decode(signature);
    console.log(decoded);
    setStart(decoded.iat *1000)
})


useEffect(()=>{
  if(start){
    //check and close meeting
    // var handle=setInterval(checkTime,5000);  
    
    //timer
    // var handle=setInterval(addtimer,5000); 
  }

  return ()=>{
    // clearInterval(handle);
  }
},[start]);

const checkTime = () => {
  console.log('ere')
  if(start == start+ 900000){
    console.log('TimeUp')
  }
}

const startTimer = () => {
  console.log('start')
  var handle =setInterval(addTime,1000); 
}
const addTime = () => {
  let currentTime = document.getElementById('Main-timer').innerText
  let timeArr = currentTime.split(':')

  timeArr[0] = parseInt(timeArr[0])
  timeArr[1] = parseInt(timeArr[1]) + 1
  if(timeArr[1]>= 60){
    timeArr[0] = timeArr[0] + 1
    timeArr[1] = 0
  }

  //zero adders if less than 9
  let secString, minString
  if(timeArr[0]<=9){
    minString = `0${timeArr[0]}`
  }else{
    minString = `${timeArr[0]}`
  }

  if(timeArr[1]<=9){
    secString =`0${timeArr[1]}`
  }else{
    secString = `${timeArr[1]}`
  }

  document.getElementById('Main-timer').innerText = `${minString}:${secString}`


  if(minString == meetingLength){
    console.log('leave')
    window.location.href = redirectUrl
  }

}

const showZoomDiv = () => {
    document.getElementById('zmmtg-root').style.display = 'block'
}
const initializeMeeting = () =>  {
    console.log({signature},'inside initMeetin')
    ZoomMtg.init({
        leaveUrl: leaveUrl,
        success: (success) => {
          console.log(success,signature,'success init')
      
          ZoomMtg.join({
            signature: signature,
            meetingNumber: parseInt(meeting_id),
            userName: username,
            sdkKey: sdkKey,
            passWord: meeting_password,
            success: (success) => {
              console.log(success,'joined success')
              startTimer()
            },
            error: (error) => {
              console.log(error,'err inside join')
            }
          })
      
        },
        error: (error) => {
          console.log(error,'err occured in init')
        }
      })
}
  return (
    <div>
      <div className='Main-timer' id='Main-timer'>00:00</div>
      Zoom
    </div>
  )
}
