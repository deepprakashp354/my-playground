import xhttp from './../libs/network';
import { getConfig } from './../AppConfig';

export function getChurchMembersData(token, churchId) {
    return new Promise((resolve, reject) => {
        // var url = getConfig('host')+getConfig('root')+"/church/members";
        var url = getConfig('host')+getConfig('root')+'/church?_id='+churchId

        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
} 

// getting all members of a church new API
export function getMembersChurchData(token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+'/church/members'

        var input = {
            url: url,
            method: 'GET',
            headers: {
                "ct-auth-token": token,
                'Content-Type': 'application/json' 
            }
        };
        console.log('the input is', input);
        xhttp(input).then((resp) => {
            resolve(resp.data)
            console.log('the response we are getting', resp.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

export function acceptRequest(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/church/request";

        var input = {
            url : url,
            method : "PUT",
            data : data,
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function rejectRequest(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/church/request";

        var input = {
            url : url,
            method : "DELETE",
            data : data,
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}