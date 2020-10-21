import * as _ from 'lodash';
import Jimp from 'jimp';
import store from './../../store';
import { refreshTokenHandler } from './../dataHandler/user.handler';
import { refreshTokenAction, updateUserAction } from './../../actions/userAction';
import * as socketIo from './../socket/init';
import ImageCompressor from 'image-compressor.js';

const compressionParameters = {
	'100000': 0.5,
	'500000': 0.4,
	'1000000': 0.3,
	'3000000': 0.2,
	'7000000': 0.1,
}

// get store
export function getStore(reducer = null){
    if(reducer === null)
        return store.getState();
    else return store.getState()[reducer];
}

// is logged in
export function isLoggedIn(){
    var user = getStore('user');
    var auth  = user.loginData;
    if(auth.status && Object.keys(auth.data).length !== 0) return true;
    else return false;
}

// redirect
export function redirect(props, path, data = null){
    if(props.location.pathname !== path)
        props.history.push({
            pathname : path,
            data : data
        })
}

// logout
export function logout(){
    var user = getStore('user');
    user.loginData = {};

    var newUserData = Object.assign({}, user);
    store.dispatch(updateUserAction(newUserData));
    // console.log(user)
}

// get formated time
// Get this function to work
export function getFormatedDate(datestring){
    var date = new Date(datestring);
    var currentDate = new Date();

	var delta = currentDate.getTime() - date.getTime();
    var minutes = 60*1000;
    var hours = 60 * minutes;
    var day = 24 * hours;
    var month = 30 * day;
    var year = 365 * day;

    var label = "moments";
    var timeNumber = "";

	if (delta/year > 1) {
		label = 'years'
		timeNumber = Math.floor(delta/year);

	}
	else if (delta/month > 1) {
		label = "months";
        timeNumber = Math.floor(delta/month);
	}
	else if(delta/day > 1) {
        label = "days";
        timeNumber = Math.floor(delta/day);
	}
	else if(delta/hours > 1){
        label = "hours";
        timeNumber = Math.floor(delta/hours);
	}
	else if(delta/minutes > 1){
        label = "minutes";
        timeNumber = Math.floor(delta/minutes);
    }

    var timeObj = {
        label : label,
        timeNumber : timeNumber
    }

    return timeObj.timeNumber.length !== 0 ? timeObj.timeNumber+" "+timeObj.label+" ago" : timeObj.label+" ago";
}

// refresh token
export function refreshToken(){
    return new Promise((resolve, reject) => {
        if(!isLoggedIn()) reject();
        else{
            var user = getStore('user');
            var auth = Object.assign({}, user.loginData.data);
            var token = auth.refreshToken;
            // refresh token
            refreshTokenHandler(token).then((result) => {
                if(result.status === 200 && result.data.status){
                    var newAuthData = Object.assign({}, user.loginData);
                    newAuthData.data.token = result.data.data.token;
                    newAuthData.data.refreshToken = result.data.data.refreshToken;
                    // set store
                    store.dispatch(refreshTokenAction(newAuthData));
                    // reinitialize socket
                    if(socketIo.getSocket() === null) socketIo.init(result.data.data.token);
                    resolve(result.data.data.token)
                }
                else reject();
            }).catch((error) => {
                reject(error);
            })
        }
    })
}

// check permission
export function checkPermission(permission){
    try {
        var user = getStore('user');
        var auth = Object.assign({}, user.loginData.data);
        var permissions = auth.userGroup.permissions;

        var query = {
            name : permission
        }

        if(_.find(permissions, query)) return true;
        else return false;
    }catch(error) {
        return false;
    }
}

// geolocation
export function getLatLng(){
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) return navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
    
            resolve ({
                lat : lat,
                lng : lng
            })
        });
        else reject({message : "geolocation not available"});
    })
}

// compress image
export function getCompressedBlob(fileData){
    return new Promise((resolve, reject) => {
        Jimp.read(fileData, (err, img) => {
            if (err) reject(err);
            // compress image and get buffer
            img.quality(60).getBuffer(Jimp.MIME_JPEG, function(err, img){
                var f = new Blob([img]);
                resolve(f);
            })
        });
    })
}

export function compressTheImage(file, quality) {

	const imageCompressor = new ImageCompressor();
	var compressionQuality = 0.2;

	for (let sizeFactor in compressionParameters) {
		sizeFactor = Number(sizeFactor)

		// Problem here is the upper limit of the file size parameter is being taken.
		if (sizeFactor > file.size) {
			compressionQuality = compressionParameters[sizeFactor];
			break;
		}
	}
	
	return new Promise((resolve, reject) => {
		imageCompressor.compress(file, {quality: compressionQuality})
		.then((result) => {
			resolve(result);
		})
		.catch((err) => {
			reject(err);
		})
	})
}

export function getFormattedDateTime() {

	var timezone_offset_min = new Date().getTimezoneOffset(),
	offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
	offset_min = Math.abs(timezone_offset_min%60),
	timezone_standard;

	if(offset_hrs < 10)
		offset_hrs = '0' + offset_hrs;

	if(offset_min < 10)
		offset_min = '0' + offset_min;

	// Add an opposite sign to the offset
	// If offset is 0, it means timezone is UTC
	if(timezone_offset_min < 0)
		timezone_standard = '+' + offset_hrs + ':' + offset_min;
	else if(timezone_offset_min > 0)
		timezone_standard = '-' + offset_hrs + ':' + offset_min;
	else if(timezone_offset_min === 0)
		timezone_standard = 'Z';

	var dt = new Date(),
	current_date = dt.getDate(),
	current_month = dt.getMonth() + 1,
	current_year = dt.getFullYear(),
	current_hrs = dt.getHours(),
	current_mins = dt.getMinutes(),
	current_secs = dt.getSeconds(),
	current_datetime;

	// Add 0 before date, month, hrs, mins or secs if they are less than 0
	current_date = current_date < 10 ? '0' + current_date : current_date;
	current_month = current_month < 10 ? '0' + current_month : current_month;
	current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
	current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
	current_secs = current_secs < 10 ? '0' + current_secs : current_secs;

	// Current datetime
	current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;

	return current_datetime + timezone_standard
}

// convert date
export function convertDate(datestring){
    var d = new Date(datestring);
    var day = d.getDate();
    day = day.toString().length == 1 ? "0"+day : day;
    var month = d.getMonth() + 1;
    month = month.toString().length == 1 ? "0"+month : month;
    var year = d.getFullYear();
    var min = d.getMinutes();
    min = min.toString().length == 1 ? "0"+min : min;
    var hr = d.getHours();
    hr = hr.toString().length == 1 ? "0"+hr : hr
    var time = hr+":"+min+":00";
    var time12Hrs = convertTo12Hours(time);
    var formateddate = month+"/"+day+"/"+year;
    return formateddate+" "+time12Hrs;
}
// convert to 12 hrs
export function convertTo12Hours(time){
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
        time = time.slice (1);
        time[5] = +time[0] < 12 ? ' AM' : ' PM';
        time[0] = +time[0] % 12 || 12;
    }
    return time.join ('');
}

module.exports = {
    redirect,
    isLoggedIn,
    getStore,
    refreshToken,
    logout,
    checkPermission,
    getFormatedDate,
    getLatLng,
    compressTheImage,
    getFormattedDateTime,
    convertDate,
    convertTo12Hours
}