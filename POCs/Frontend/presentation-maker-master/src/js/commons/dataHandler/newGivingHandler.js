import xhttp from './../libs/network';
import { getConfig } from './../AppConfig'
import { resolve } from 'url';

export function getFund(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/funds/admin";

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

export function createFund(token,obj){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/funds";

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
            reject(error)
        })
    })
}

export function stripeconnectCheck(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/connected";

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

export function getFundsName(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/funds/open";

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


export function closeFund(token,id){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/funds";

        var input = {
            url : url,
            method : "DELETE",
            data : {
                id: id
            },
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

export function hideFund(token,obj){
    return new Promise((resolve,reject) =>{
        var url = getConfig('host')+getConfig('root')+"/givings/funds/state";

        var input = {
            url : url,
            method : "PUT",
            data : obj,
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

export function deleteFund(token,id){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/funds";

        var input = {
            url : url,
            method : "DELETE",
            data : id,
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

export function editFund(token,obj){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/funds/";

        var input = {
            url : url,
            method : "PUT",
            data : obj,
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

export function fetchUserTransaction(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/list/admin/1/5";

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

export function fetchUserTransactionPg(token,page){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/list/admin/"+page+"/5";

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


export function fetchAdminTransaction(token,fundId){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/list/admin/1/5?fundId="+fundId;

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


export function fetchAdminTransactionUid(token,Uid){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/list/admin/1/5?userId="+Uid;

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


export function fetchUserSubscri(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/subscriptions";

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

export function createOfflineGiving(token,data){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/offline";

        var input = {
            url : url,
            method : "POST",
            data : data,
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

export function getChartData(token,id,date){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/list/transactionGraph/admin?filterDays="+date+"&fundId="+id;

        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
            }
        };
        xhttp(input).then((resp) => {
            console.log("input",input)
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function getUserFund(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/funds";

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

export function getUserChartData(token,id,date){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/givings/list/transactionGraph?filterDays="+date+"&fundId="+id;

        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
            }
        };
        xhttp(input).then((resp) => {
            console.log("input",input)
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

