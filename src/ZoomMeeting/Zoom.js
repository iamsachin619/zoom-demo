import React, { useEffect } from 'react'
import CryptoJS from 'crypto-js'

import { KJUR } from 'jsrsasign';
import {Buffer} from 'buffer';
import { ZoomMtg } from '@zoomus/websdk'
import './Zoom.css'
export default function Zoom({name, roleUser,Email}) {

let apiKey = 'ZLDSZm0QR6CJOXdY_VZy7g'
let apiSecret = 'yrHRncbUhgW1iH2vyhrYTmyqLm0WvrQhBhnF'
let sdkKey = 'pQgYcxmQwygXIHiwyNy691G6So5aUjF4fIi4'
let sdkSecret = '28Xur9RGCEwdwpMoAOCPCHWFemPCR9IZaEa2'
let leaveUrl = 'http://localhost:3000/exited'
let meetingNumber =  77669282631
let userName = name
let userEmail = Email
let passWord = '2L80Z3'
let role = parseInt(roleUser); //role 1 is for admin
let signature = ''

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
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }
  
    const oPayload = {
      sdkKey: sdkKey,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      appKey: sdkKey,
      tokenExp: iat + 60 * 60 * 2
    }
  
    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret)
    console.log(sdkJWT)
    return sdkJWT
  }


useEffect(()=>{
    showZoomDiv()
    signature =  generateSignature(sdkKey, sdkSecret, meetingNumber, role)
    console.log({signature})
    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.7.0/lib','/av')
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareWebSDK()
    initializeMeeting()
})

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
            meetingNumber: meetingNumber,
            userName: userName,
            sdkKey: sdkKey,
            passWord: passWord,
            success: (success) => {
              console.log(success,'joined success')
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
    <div>Zoom</div>
  )
}
