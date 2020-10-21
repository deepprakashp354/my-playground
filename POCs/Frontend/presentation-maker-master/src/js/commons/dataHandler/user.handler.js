import xhttp from './../libs/network';
import { getConfig } from './../AppConfig';
import * as socketIo from './../socket/init';

export function registerUser(userData){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/registerWithOtp";

        var input = {
            url : url,
            method : "POST",
            data : userData
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function loginWithPhone(userData) {
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/login/";

        var input = {
            url : url,
            method : "POST",
            data : userData,
            headers : {
                "Content-Type" : "application/json",
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function loginUser(userData){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/login/";

        var input = {
            url : url,
            method : "POST",
            data : userData,
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function verifyPhoneOtp(otp) {
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/otp/verify";

        var input = {
            url : url,
            method : "PUT",
            data : otp
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function forgotPass(data) {
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/password/forgot";

        var input = {
            url : url+"?username="+data,
            method : "GET",
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function abc(api,otp){
    return new Promise((resolve,reject) => {
        var url = api
        var input = {
            url : api+"/"+otp,
            method : "PUT",
        };
        // console.log("url",url)
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function verifyEmailOtp(api,otp) {
    return new Promise((resolve,reject) => {
        var url = api
        var input = {
            url : api+"/"+otp,
            method : "PUT",
        };
        // console.log("url",url)
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function passwordChanged(api, password) {
    return new Promise((resolve,reject) => {
        var url = api
        var input = {
            url : url,
            method : "PUT",
            data : {
                password : password
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function resendMobileOtp(data) {
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/otp/resend/phone/";
        var input = {
            url : url+"?phone="+data,
            method : "GET"
        }
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function logout(data) {
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/logout";
        var input = {
            url : url+"?userId="+data,
            method : "GET"
        }

        // disconnect socket
        socketIo.disconnect();

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function refreshTokenHandler(refreshToken){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/token/refresh";
        var input = {
            url : url,
            method : "PUT",
            data : {
                refreshToken : refreshToken
            }
        }

        xhttp(input).then((resp) => {
            resolve(resp)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function resendEmail(resendEmail){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/verify/email/";
        var input = {
            url : url+"?email="+resendEmail,
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function resendMail(resendMailData){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/resend/email/verify";
        var input = {
            url : url,
            method : "POST",
            data : resendMailData,
            headers : {
                "Content-Type" : "application/json",
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function resendEmailOtp(api){
    return new Promise((resolve, reject) => {
        var url = api
        var input = {
            url : url,
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function updateMail(api, email){
    // console.log("emial",email)
    return new Promise((resolve, reject) => {
        var url = api
        var input = {
            url : url,
            method : "PUT",
            data : {
                newEmail : email
            },
            headers : {
                "Content-Type" : "application/json",
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp)
        }).catch((error) => {
            reject(error);
        })
    })
}