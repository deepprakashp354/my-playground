import { getFormattedDateTime, getStore } from "./../libs/Utils"

import { firebase, database } from "./../dataHandler/firebase";
import store from "../../store";
import { pushRealTimeMembers, storeChatMessages, modifyMessageCount, saveAccessToken } from "./../../actions/firebaseAction";
import { getConfig } from "../AppConfig";
import xhttp from "../libs/network";


export function signIntoFirebase(token) {
    return new Promise((resolve, reject) => {

        // console.log("HITTING IT OVER");

        const url = getConfig('host') + getConfig('root') + "/firebase/token";
        const input = {
            "url": url,
            "method": "GET",
            "headers" : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            }
        }

        xhttp(input).then((customTokenData) => {
            const auth = firebase.auth;
            let signInToken = customTokenData.data.data;
            auth().signInWithCustomToken(signInToken).then((success) => {
                resolve(success)
            }).catch((err) => {
                console.log("FAILED TO LOG INTO FIREBASE", err);
            })
        }).catch((err) => {
            console.log("FAILED TO HIT THE API", err);
        })
    })
}

export function signOutFromFirebase() {
    let auth = firebase.auth;
    return auth().signOut();
};

export function getLiveMembers(churchId, userId, token) {

    if (typeof churchId !== 'string' || churchId.length < 1)
        return //nothing
    const reference = churchId + "/users"
    const dbRef = database.ref(reference);

    //  Real time event whenever user goes online/ offline
    dbRef.on('value', (snapshot) => {
        var liveMembers = snapshot.val();
        var churchMembers = []
        var churchAdminData;

        if (liveMembers) {
            Object.keys(liveMembers).map((member) => {
                if (member !== userId) {
                    let temp = liveMembers[member];
                    churchMembers.push(temp);
                }
            })

            churchMembers.sort((x, y) => {
                if (x.name && y.name) {
                    // Can use let someValue = ("" + x.name).toLowerCase(); for better type checking
                    let firstEntry = x.name.toLowerCase();
                    let secondEntry = y.name.toLowerCase();

                    if (firstEntry < secondEntry)
                        return -1

                    if (firstEntry > secondEntry)
                        return 1
                }
                return 0
            });

            var tempStore = []
            store.dispatch(pushRealTimeMembers(churchMembers));
        } else {
            store.dispatch(pushRealTimeMembers([]));
        }
    }, function (err) {
        // Need to chex real time events
        // looks like connections are not duplicated

        // Error listening to realtime db
        // store.dispatch(saveAccessToken(token));
        // getLiveMembers(churchId, userId, token);
        // store.dispatch(pushRealTimeMembers([]));
    })
}

export function getMessageThread(churchId, threadId) {
    const reference = churchId + "/messages/" + threadId;
    const dbRef = database.ref(reference).orderByChild("createdAt");
    var chatMessages;

    chatMessages = dbRef.on('value', (chatThread) => {
        const threadMessages = chatThread.val();

        if (threadMessages && threadMessages.length !== 0) {
            chatMessages = Object.values(threadMessages);
        }
        else {
            chatMessages = [];
        }

        var chats = Object.assign({}, getStore("firebase")["userChats"]);
        chats[threadId] = chatMessages;

        // var newChats = Object.assign({}, chats);
        // store.dispatch(storeChatMessages(newChats));
        store.dispatch(storeChatMessages(chats));
    }, function (err) {
        console.log("ERROR FETCHING USER THREAD", err);
    })
}

export function createMessageThread(churchId, memberId, userId) {

    const openRef = database.ref(churchId + "/open");
    
    const threadsRef = database.ref(churchId + "/threads/");
    var userThreadsRef = churchId + "/userthreads/";

    const thread_ID = threadsRef.push().key;

    // const rightNow = new Date().toISOString();
    const rightNow = getFormattedDateTime();

    // First create a thread
    var threadData = {
        "id": thread_ID,
        "lastMessage": "",
        "createdAt": rightNow,
        "lastUpdated": rightNow
    }

    threadsRef.child(thread_ID).set(threadData);
    threadsRef.child(thread_ID).child("members").child(userId).set(true);
    threadsRef.child(thread_ID).child("members").child(memberId).set(true);

    // Then update the user with that thread

    var senderRef = database.ref(userThreadsRef + userId);
    threadData["memberId"] = memberId;
    senderRef.child(thread_ID).set(threadData);

    var receiverRef = database.ref(userThreadsRef + memberId);
    threadData["memberId"] = userId;
    receiverRef.child(thread_ID).set(threadData);

    // modify open thread
    // openRef.child(thread_ID).child(userId).set(false);
    // openRef.child(thread_ID).child(memberId).set(false);

    return thread_ID;
}

// Fetch all the messages for the user
// Check if message exists for the member you are talking to
// If member exists, Open a connection to the rdb for member-member chat
// If member does not exist, Create a thread for that user
export function fetchMessages(userId, churchId, memberId, chatMessages) {
    return new Promise((resolve, reject) => {
        const reference = churchId + "/userthreads/" + userId;
        const dbRef = database.ref(reference);
        var memberChat, threadId;


        // Fetch all the threads for the user
        dbRef.once('value', (userChatData) => {
            var chatMessageData = userChatData.val();
            if (!chatMessageData || chatMessageData == null) {
                chatMessageData = {}
            }
            memberChat = Object.keys(chatMessageData).filter((id) => {
                let temp = chatMessageData[id]
                if (temp.memberId == memberId) {
                    return temp;
                }
            })

            // If array exists, getMessages for that thread
            if (Array.isArray(memberChat) && memberChat.length != 0) {
                threadId = memberChat[0];
                getMessageThread(churchId, threadId);
                unsetCount(churchId, userId, threadId);
                resolve(threadId);
            } else {
                threadId = createMessageThread(churchId, memberId, userId);
                getMessageThread(churchId, threadId);
                resolve(threadId);
            }
        }, function (err) {
            console.log("ERROR fetching chat-thread", err);
        })
    })
}

export function userTyping(churchId, threadId, userId, name, isTyping = false) {
    // Set typing TRUE for the THREAD under the CHURCH by the USER
    const statusRef = database.ref(churchId + "/status/" + threadId + "/" + userId);

    statusRef.child("name").set(name);
    statusRef.child("typing").set(isTyping);
}

export function sendMessage(message, churchId, threadId, userId, receiverId, receiverOnline = false) {

    const messageRef = database.ref(churchId + "/messages/" + threadId);
    const threadsRef = database.ref(churchId + "/threads/" + threadId);
    const userThreadsRef = database.ref(churchId + "/userthreads/");
    const countsRef = database.ref(churchId + "/count");
    const openScreenRef = database.ref(churchId + "/open/" + threadId + "/" + receiverId);

    // const rightNow = new Date();
    const rightNow = getFormattedDateTime()

    // First add a message
    var messageKey = messageRef.push().key;

    var messageData = {
        "receiverId": threadId,
        "senderId": userId,
        "senderName": "HARDCODE_WEB_NAME",
        "text": message,
        "time": rightNow
    }

    messageRef.child(messageKey).set(messageData);

    // Then update the threads
    threadsRef.child(threadId).child('lastMessage').set(message);
    threadsRef.child(threadId).child('lastUpdated').set(rightNow);

    // Then the userthreads
    // For user
    userThreadsRef.child(userId).child(threadId).child("lastUpdated").set(rightNow);
    userThreadsRef.child(userId).child(threadId).child("lastMessage").set(message);

    // For receiver
    userThreadsRef.child(receiverId).child(threadId).child("lastUpdated").set(rightNow);
    userThreadsRef.child(receiverId).child(threadId).child("lastMessage").set(message);

    // Meanwhile you also need to update the count and status
    //if (!receiverOnline) {
        // countsRef.child(receiverId).child(threadId).child(messageKey).set(true);

        openScreenRef.once('value').then((snapshot) => {
            let shouldCountIncrease = snapshot.val();
            if (!shouldCountIncrease) {
                countsRef.child(receiverId).child(threadId).child(messageKey).set(true);
                countsRef.child(receiverId).child(threadId).child("sender").set(userId);
            }
        })
    //}
}

// Add this on login
// required parameters: churchId, email, _id, name, phone, profileUrl
export function addUserToChat(userData, isOnline = false) {
    if (userData.churches && userData.churches[0] && userData.churches[0].churchId) {
        const churchId = userData.churches[0].churchId._id;
        const usersRef = database.ref(churchId + "/users");
        // const rightNow = new Date().toISOString();
        const rightNow = getFormattedDateTime();

        const userPayload = {
            "deviceType": "Web",
            "isOnline": isOnline,
            "lastSeen": rightNow,
            "emailId": userData.email,
            "id": userData._id,
            "name": userData.name,
            "phone": userData.phone || "",
            "profileUrl": userData.profileUrl || ""
        }

        usersRef.child(userData._id).set(userPayload);
    } else {
        // No church-ID found;
    }
}

export function closeRealTimeChat(threadId, churchId) {
    const reference = churchId + "/messages/" + threadId;
    const dbRef = database.ref(reference);

    dbRef.off();
}

export function closeRealTimeLiveMembers(churchId) {
    const reference = churchId + "/users"
    const dbRef = database.ref(reference);

    dbRef.off();
}

export function removeUserFromChat(churchId, userId) {
    const ref = churchId + "/users";
    const dbRef = database.ref(ref);
    dbRef.child(userId).remove();
}

export function closeRealTimeCount(churchId, userId) {
    const dbRef = database.ref(churchId + "/count/" + userId);
    dbRef.off();
}

export function getCount(churchId, userId) {

    const ref = churchId + "/count/" + userId;
    const dbRef = database.ref(ref);
    var countsObj = {};

    dbRef.on('value', (countData) => {
        const countsData = countData.val();
        if (countsData) {
            // counts Data is an object. Each key is the threadId
            // Each object as it's value are the messages
            Object.keys(countsData).map((thread) => {
                let count = Object.keys(countsData[thread]).length;
                countsObj[thread] = {
                    "count": count - 1,
                    "sender": countsData[thread].sender
                };
            })
            let mutatedObj = Object.assign({}, countsObj);
            store.dispatch(modifyMessageCount(mutatedObj));
        }
    }, function (err) {
        // error fetching counts
        console.log("ERROR LISTENING TO REAL TIME ", err);
        store.dispatch(modifyMessageCount({}))
    })
}

export function unsetCount(churchId, userId, threadId) {
    // console.log("==", churchId, userId, threadId, "===");
    const countRef = database.ref(churchId + "/count/" + userId + "/" + threadId);
    countRef.remove();
}

export function openScreen(churchId, userId, threadId, isOpen = false) {
    const openRef = database.ref(churchId + "/open");
    openRef.child(threadId).child(userId).set(isOpen);
}

export function hangSockets(churchId, userId) {
    removeUserFromChat(churchId, userId);
    closeRealTimeLiveMembers(churchId);
    closeRealTimeCount(churchId, userId);
}