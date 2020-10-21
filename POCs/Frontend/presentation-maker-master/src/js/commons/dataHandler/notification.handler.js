import xhttp from './../libs/network';
import { getConfig } from './../AppConfig';

// export function getNotificationHandler(payload){
//     return new Promise((resolve, reject) => {
//         var url = getConfig('socketHost')+"notification?userId="+payload.userId;
//         var input = {
//             url : url,
//             method : "GET",
//             headers : {}
//         };

//         xhttp(input).then((resp) => {
//             resolve(resp.data)
//         }).catch((error) => {
//             reject(error);
//         })
//     })
// }


export function getNotificationHandler(payload,pgno){
    return new Promise((resolve, reject) => {
        var url = getConfig('socketHost')+"api/activity/notification/"+pgno+"/14?userId="+payload.userId;
        // var url = getConfig('socketHost')+"notification/"+pgno+"/14?userId="+payload.userId;
        var input = {
            url : url,
            method : "GET",
            headers : {}
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}