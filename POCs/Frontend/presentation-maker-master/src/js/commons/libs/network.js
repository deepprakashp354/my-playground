import axios from 'axios';
import * as Utils from './Utils';
import { hangSockets } from './../dataHandler/chat.handler';

/* Input
    {
        method: 'post',
        url: '/user/12345',
        data: {
            firstName: 'Fred',
            lastName: 'Flintstone'
        }
    }

    check axios documentation for more options
*/

export default function xhttp(input){
    return new Promise((resolve, reject) => {
        axios(input).then((resp) => {
            resolve(resp);

        }).catch((error) => {
            // forbidden refresh token
            if (error.response && error.response.status === 401)
                Utils.refreshToken().then((token) => {
                    input.headers['ct-auth-token'] = token;
                    xhttp(input).then((r) => {
                        resolve(r);
                    }).catch((error) => {
                        Utils.logout();
                    })
                }).catch((err) => {
                    Utils.logout()
                })
            else if(error.response && error.response.status === 403) {
                // var user = Utils.getStore('user');
                // var auth = user.loginData;
                // var userId = auth.data._id;
                // if(auth.data && auth.data.churches && auth.data.churches && auth.data.churches.length !== 0 
                //     && auth.data.churches && auth.data.churches[0] && auth.data.churches[0].churchId && auth.data.churches[0].churchId._id){
                //         var churchId = auth.data.churches[0].churchId._id;
                // }
                // hangSockets(churchId, userId);
                // alert('This session has expired as you have logged into another device.');
                Utils.logout();
            }
            else{
                reject(error);
            }
        })
    })
}
