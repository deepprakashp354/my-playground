import openSocket from 'socket.io-client';
import { getConfig } from './../AppConfig';
import * as events from './events';
import { getStore, isLoggedIn } from './../libs/Utils';

var socket = null;

function init(accesstoken = null){
    
    if(!isLoggedIn()) return false;
   
    var user = getStore('user');
    var auth = Object.assign({}, user.loginData.data);
    var token = accesstoken;
    if(accesstoken === null)
        token = auth.token;
        
    // socket query
    var socketQuery = {
        query : "token="+token,
        transports: ['websocket'],
        path : "/api/client/socket.io"
    }

    // open socket
    socket = openSocket(getConfig('socketHost'), socketQuery);

    // timer
    this.subscribeToTimer(() => {
        // console.log("subscribed to timer");
    })
     

    // connect events
    events.connect(socket);

    return socket;
}

function disconnect(){
    socket.disconnect();
    socket = null;
}

function getSocket(){
    
    return socket;
}

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

module.exports = { 
    init : init,
    subscribeToTimer : subscribeToTimer,
    getSocket : getSocket,
    disconnect : disconnect
};