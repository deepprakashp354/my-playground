import xhttp from "../libs/network";

export function fetchbug(token){
    var url = "http://34.238.51.44/api/bugs/"
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
                "Content-Type" : "application/json"
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function createBug(token,obj){
    var url =  "http://34.238.51.44/api/bugs/"
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "POST",
            data : obj,
            headers : {
                "ct-auth-token": token
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}