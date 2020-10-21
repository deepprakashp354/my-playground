var twilio = require('twilio');
import { AppConfig } from 'ct-app-config';

const appConfig = new AppConfig();

export class PhoneOtp {
    sendOtp(payload:any){ 
      return new Promise((resolve:any, reject:any)=>{
        
        //getting accountSid and authToken from   
        var phoneConfig = appConfig.getConfig("phoneVerificationConfig");

          var Sid = phoneConfig.accountSid; 
          var Token = phoneConfig.authToken; 
          var C_Talk_No = phoneConfig.C_Talk_No;

          var client = new twilio(Sid, Token);
          
          client.messages.create({
            body : 'The One Time Password (OTP) for your Churchtalk account is '+ payload.OTP,
            to : payload.phoneNo,  // Text this number
            from : C_Talk_No // From a valid Twilio number
            
          }).then((message) => {
              resolve(message)
          }).catch((error) =>{
            
              reject(error);
          })
      })
    }
}
