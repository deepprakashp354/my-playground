import * as Utils from './../libs/Utils';
import * as _ from 'lodash';
import store from './../../store';
import { updateBulletinAction, updateBulletinCommentAction, updateMemberRequestData, updateBulletinLocalAction } from './../../actions/updaterAction';
import { updateNotificationAction } from './../../actions/notificationAction';
import { bulletinNotificationAction } from './../../actions/bulletinAction';
import { sendPrayerWithdrawRequestAction, sharePrayerAction } from './../../actions/journalAction'
import { updateUserDataAction } from './../../actions/userAction';
import { addUserToChat, getLiveMembers } from '../dataHandler/chat.handler';

// update Notification
function updateNotification(data){
    var notificationStore = Utils.getStore('notification');
    var notificationsData = notificationStore.notifications;
    var notifications = Object.assign([], notificationsData.data);

    var newNotifications = [];
    data.map((v, k) => {
        newNotifications.push(v);
    })

    var concatinated = newNotifications.concat(notifications);
    notificationsData.data = Object.assign([], concatinated);
    var newNotificationsData = Object.assign({}, notificationsData);

    store.dispatch(updateNotificationAction(newNotificationsData));
}

// update bulletin
function updateBulletin(data){
    var newFeeds = [];
    
    data.map((v, k) => {
        newFeeds.push(v.data);
    })

    store.dispatch(bulletinNotificationAction(newFeeds));
    // update notifications
    this.updateNotification(data);
}

// update comment
function updateComment(data){
    var bulletinStore = Utils.getStore('feed');
    var bulletinData = bulletinStore.updatingFeedPaginData || {};
    var feedData = Object.assign([], bulletinData.data);

    data.map((v, k) => {
        var comment = v.data;
        var index = _.findIndex(feedData, {_id : comment.feedId});
        
        if(index !== -1){
            feedData[index].commentCount += 1;
            // feedData[index] = Object.assign({}, feed);
        }
    })

    // bulletin
    var bulletin = Object.assign({}, bulletinStore.updatingFeedPaginData);
    bulletin.data = Object.assign([], feedData)
    
    var newBulletinData = Object.assign({}, bulletin);

    store.dispatch(updateBulletinLocalAction(newBulletinData));

    this.updateNotification(data);
}

// update reaction
function updateReaction(data){
    var bulletinStore = Utils.getStore('feed');
    var bulletinData = bulletinStore.updatingFeedPaginData || {};
    var feedData = Object.assign([], bulletinData.data);

    data.map((v, k) => {
        var feed = v.data;
        var index = _.findIndex(feedData, {_id : feed._id});
        
        if(index !== -1)
            feedData[index] = Object.assign({}, feed);
    })

    // bulletin
    var bulletin = Object.assign({}, bulletinStore.updatingFeedPaginData);
    bulletin.data = Object.assign([], feedData)
    
    var newBulletinData = Object.assign({}, bulletin);

    store.dispatch(updateBulletinLocalAction(newBulletinData));

    // update notifications
    this.updateNotification(data);
}

// update member request
function updateMemberRequest(data){
    if(data[0].hasOwnProperty('data') && data[0].data.status == "accepted"){
        var userStore = Utils.getStore('user');
        var loginData = userStore.loginData || {};
        var userData = Object.assign([], loginData.data);
        var churches = Object.assign([], userData.churches);
        var churchPayload = {
            churchId : {
                _id : data[0].data.churchId._id,
                name : data[0].data.churchId.name || "",
                profileUrl : data[0].data.churchId.profileUrl || ""
            },
            role : "CHURCH_ADMIN",
            _id : ""
        }
        
        churches.unshift(churchPayload);
        userData.churches = Object.assign([], churches);
        loginData.data = Object.assign({}, userData);
        var newLoginData = Object.assign({}, loginData);
        
        store.dispatch(updateUserDataAction(newLoginData));

        // Add the user to firebase the moment he gets accepted as a church member
        const formattedData = {
            "churches": [churchPayload],
            "email": userData.email,
            "name": userData.name,
            "phone": userData.phone || "",
            "_id": userData._id,
            "profileUrl": userData.profileUrl || ""
        }
        addUserToChat(formattedData, true);

        // start listening to the real time events as well
        // assuming churchId MUST exist
        let churchId = churchPayload.churchId._id;
        getLiveMembers(churchId, userData._id);
    }

    var bulletinStore = Utils.getStore('feed');
    var memberRequestData = bulletinStore.getMemberRequest;
    var MemberRequest = Object.assign([], memberRequestData.data);

    var newRequest = [];
    data.map((v,k) => {
        newRequest.push(v);
    })

    var concatinated = newRequest.concat(MemberRequest);
    memberRequestData.data = Object.assign([], concatinated);
    var newMemberRequestData = Object.assign({}, memberRequestData);
    store.dispatch(updateMemberRequestData(newMemberRequestData))
}

// withdraw request
function updateWithdrawPrayer(data){
    var journalStore = Utils.getStore('journal');
    var withdrawRequestData = journalStore.withdrawGetNotification;
    var withdrawRequest = Object.assign([],withdrawRequestData.data);

    var newRequest = [];
    data.map((v,k) => {
        newRequest.push(v);
    })

    var concatinated = newRequest.concat(withdrawRequest);
    withdrawRequestData.data = Object.assign([],concatinated);
    var newWithdrawrequestData = Object.assign({}, withdrawRequestData);

    store.dispatch(sendPrayerWithdrawRequestAction(newWithdrawrequestData))

    this.updateNotification(data);
}

//share Prayer
function updateSharePrayer(data){
    var journalStore = Utils.getStore('Journal');
    var sharePrayerData = journalStore.sharedPrayer;
    var sharePrayer = Object.assign([],sharePrayerData.data);

    var newRequest = [];
    data.map((v,k) => {
        newRequest.push(v);
    })

    var concatinated = newRequest.concat(sharePrayer);
    sharePrayerData.data = Object.assign([],concatinated);
    var newSharePrayerData = Object.assign({},sharePrayerData);

    store.dispatch(sharePrayerAction(newSharePrayerData))

    this.updateNotification(data);
}

module.exports = {
    updateNotification : updateNotification,
    updateBulletin : updateBulletin,
    updateComment : updateComment,
    updateReaction : updateReaction,
    updateMemberRequest : updateMemberRequest,
    updateWithdrawPrayer : updateWithdrawPrayer,
    updateSharePrayer : updateSharePrayer
} 
