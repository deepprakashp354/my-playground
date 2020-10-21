import xhttp from './../libs/network';
import { getConfig } from './../AppConfig'

export function getChat(data,token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/auto";

        var input = {
            url : url,
            method : "POST",
            data : data,
            headers : {
                "ct-auth-token": token,
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

export function fetchTransactions(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/pay/giving";

        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function fetchCustomer(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/customer";

        var input = {
            url : url,
            method : "GET",
            headers: {
                "ct-auth-token": token,
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function submitPayment(obj,token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/pay/giving";

        var input = {
            url : url,
            method : "POST",
            data : obj,
            headers : {
                "ct-auth-token": token,
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error.response.data)
        })
    })
}

export function fetchAdminTransaction(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/pay/giving?church=true";

        var input = {
            url : url,
            method : "GET",
            headers: {
                "ct-auth-token": token,
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function connectAdminWithStripe(credential, token) {

    return new Promise((resolve, reject) => {
        const data = {
            "access": credential
        }
        var url = getConfig("host") + getConfig("root") + "/pay/giving/auth"
        //var url = "http://localhost:3000/api/v1/pay/giving/auth"

        var input = {
            url: url,
            method: "POST",
            headers: {
                "ct-auth-token": token,
            },
            data: data,
        }

        xhttp(input).then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function isAdminConnected(token, credential) {
    return new Promise((resolve, reject) => {
        
        var url = getConfig("host") + getConfig("root") + "/customer/card?type=admin_connected"
        
        var input = {
            url: url,
            method: "GET",
            headers: {
                "ct-auth-token": token,
            }
        }

        xhttp(input).then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function sendBankToken(token, data) {
    return new Promise((resolve, reject) => {
        const url = getConfig("host") + getConfig("root") + "/pay/ach";



        const input = {
            "url": url,
            "method": "POST",
            "headers": {
                "ct-auth-token": token
            },
            "data": data
        }

        xhttp(input).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    })
}

// NEW GIVINGS CODE

export function fetchSubscriptionPage(token, data) {

    const url = getConfig("host") + "/api/payment/secure/s/subscribe";

    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
                "Content-Type" : "application/json"
            },
            "params": data
            // "data": data
            // HARDCODE
            // "params": {
            //     "amount": 69,
            //     "currency": "usd",
            //     "fundId": "5c51895eb2032d53f5a4d7b9",
            //     "mode": "STRIPE",
            //     "modeOfPayment": "WEB_APP",
            //     "frequency": 30,
            //     "cycles": 30,
            //     "startsAt": "01/31/2019"
            //     // Will be injected into the webview
            // }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}


export function fetchGivingsPage(token, data){
    const url = getConfig("host") + "/api/payment/secure/s/give";
    
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
                "Content-Type" : "application/json"
            },
            "params": data
            // "data": data
            // HARDCODE
            // "params": {
            //     "amount": 69,
            //     "currency": "usd",
            //     "fund": "5c51895eb2032d53f5a4d7b9",
            //     "mode": "STRIPE",
            //     "modeOfPayment": "WEB_APP"
            // }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}