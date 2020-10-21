import xhttp from './../libs/network';
import { getConfig } from './../AppConfig';
import store from './../../store';
import { uploadProgress } from './../../actions/bulletinAction';
import {compressTheImage} from "../libs/Utils";

export function getFeed(churchId, token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/bulletin/feed/paginate/1/4?churchId="+churchId;
        
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
            reject(error);
        })
    })
}
export function getFeedPaginate(churchId, token,pgno){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/bulletin/feed/paginate/"+pgno+"/6?churchId="+churchId;
        
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
            reject(error);
        })
    })
}

export function postFeed(postData,token){
    var url = getConfig('host')+getConfig('root')+"/bulletin/feed";

    return new Promise((resolve,reject) => {
        // compressTheImage(postData)
        // .then(() => {
            var input = {
                url : url,
                method : "POST",
                headers : {
                    "ct-auth-token" : token
                },
                data : postData
            };
            xhttp(input).then((resp) => {
                resolve(resp.data)
            }).catch((error) => {
                reject(error);
            })
        })
    //     .catch((err) => {
	// 		console.log("There was a problem compressing the image", err);
	// 		reject(err);
	// 	})
    // })
}

// compressTheImage(file)
// 		.then((compressedImage) => {
// 			coverRef.put(compressedImage)
// 				.then(() => resolve())
// 				.catch((err) => reject(err))
// 		})
// 		.catch((err) => {
// 			reject(err);
//         })
        

export function postReaction(data,token){
    var url = getConfig('host')+getConfig('root')+"/bulletin/reactions";

    return new Promise((resolve,reject) => {
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
            reject(error);
        })
    })
}

export function reactionOnComment(commentId, token){
    var url = getConfig('host')+getConfig('root')+"/bulletin/likeOnComment";

    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "PUT",
            headers : {
                "ct-auth-token": token,
            },
            data : {
                commentId : commentId
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}


export function deletePost(obj, token){
    var url = getConfig('host')+getConfig('root')+"/bulletin/feed";

    return new Promise((resolve,reject) => {
        var input = {
            url: url,
            method: "DELETE",
            headers: {
                "ct-auth-token": token
            },
            data : obj,
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function deleteComment(obj, token){
    var url = getConfig('host')+getConfig('root')+"/bulletin/comments";

    return new Promise((resolve,reject) => {
        var input = {
            url: url,
            method: "DELETE",
            headers: {
                "ct-auth-token": token
            },
            data : obj,
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function getComment(token,feed_id){
    var url = getConfig('host')+getConfig('root')+"/bulletin/comments";

    return new Promise((resolve,reject) => {
        var input = {
            url : url+"?feedId="+feed_id,
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

export function postComment(obj, token) {
    var url = getConfig('host')+getConfig('root')+"/bulletin/comments/";

    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "POST",
            data : obj,
            headers : {
                "ct-auth-token": token,
            }
        }
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}



//for getting the suggestions for user and churches
export function suggestionChurchUser(searchData,token){
    var url = getConfig('host')+getConfig('root')+"/search/churchuser/suggestions";

    return new Promise((resolve,reject) => {
        var input = {
            url : url+"?name="+searchData,
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

//list of churches and users
export function searchChurchUser(searchData,token){
    var url = getConfig('host')+getConfig('root')+"/search/churchuser";
    return new Promise((resolve,reject) => {
        var input = {
            url : url+"?name="+searchData,
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

//getting list of only churches
export function getChurchList(token){
    var url = getConfig('host')+getConfig('root')+"/church";
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: "GET",
            headers: {
                'ct-auth-token': token,
            },
            // data: data
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

//for getting church public profile 
export function getChurchProfile(id, token){
    var url = getConfig('host')+getConfig('root')+"/church/publicProfile";
    return new Promise((resolve, reject) => {
        var input = {
            url: url+"?churchId="+id,
            method: 'GET',
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

//grtting churches nearby wih latitude and longitude
export function getNearByChurches(data, token){
    var url = getConfig('host')+getConfig('root')+"/church/nearby/";
    return new Promise((resolve, reject) => {
        var input = {
            url: url+"search?lat=" + data.lat + "&lng=" + data.lng,
            method: 'GET',
            headers: {
                'ct-auth-token': token
            },
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((err) => {
            reject(err)
        })
    })
}

//join new church
export function joinNewChurch(data, token){
    var url = getConfig('host')+getConfig('root')+"/church/request";
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: "POST",
            headers: {
                "ct-auth-token": token,
            }, 
            data: data
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    }) 
}

//checking if church request is pending or not
export function checkChurchRequest(token){
    var url = getConfig('host')+getConfig('root')+"/user/churchRequest/status"; 
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            headers: {
                'ct-auth-token': token,
            },
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}


//deleting church pending request
export function cancelPendingRequest(token){
    var url = getConfig('host')+getConfig('root')+"/church/request/user";
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: "DELETE",
            headers: {
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

//exit a present church you are already a member of
export function exitChurch(token){
    var url = getConfig('host')+getConfig('root')+'/church/exitChurch';
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: "PUT",
            headers: {
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


//joF2ng church
export function joinChurchRequest(church_ids, token){
    var url = getConfig('host')+getConfig('root')+"/church/request";
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: "POST",
            headers: {
                "ct-auth-token": token,
            }, 
            data: church_ids
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}
                           
//for getting public profile
export function getPublicProfile(id,token){
    var url = getConfig('host')+getConfig('root')+"/user/publicProfile";

    return new Promise((resolve,reject) => {
        var input = {
            url : url+"?userId="+id,
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

//for endorsing skills on the public profile
export function endorseSkill(data, token) {
    var url = getConfig('host')+getConfig('root')+"/user/skills/endorse";
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: 'PUT',
            headers: {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        }
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    }) 
}

export function uploadImage(image,token){
    var url = getConfig('host')+getConfig('root')+"/bulletin/upload/post";

    // prepare form data
    var files = new FormData();
    Object.keys(image).map((v, k) => {
        var f = image[v]
        files.append('file'+k, f);
    })

    // var data = new File([blob], files)
        // compressTheImage(image)
        // .then(() => {
            return new Promise((resolve,reject) => {
                var input = {
                    url : url,
                    method : "POST",
                    data : files,
                    headers : {
                        "Content-Type" : "multipart/form-data;boundary=------------------------7d87eceb5520850c",
                        "ct-auth-token": token,
                    },
                    onUploadProgress: function(progressEvent) {
                        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total )
                        
                        store.dispatch(uploadProgress(percentCompleted));
                    }
                };

                xhttp(input).then((resp) => {
                    resolve(resp.data)
                }).catch((error) => {
                    reject(error)
                })
            })
    // })
    // .catch((err) => {
        // console.log("There was a problem compressing the image", err);
    // })
}

export function getMemberRequest(token){
    var url = getConfig('host')+getConfig('root')+"/church/request?type=CHURCH_REQUEST_NOTIFICATION";
    return new Promise((resolve,reject) => {
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

export function sendInvite(token,data){
    var url = getConfig('host')+getConfig('root')+"/invitations/user";
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "POST",
            headers : {
                "ct-auth-token": token, 
            },
            data : {
                email : data
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function clearNotif(obj){
    var url = getConfig('socketHost')+"/api/activity/notification/status/readAll";
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "PUT",
            
            data : obj
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function inviteAdmin(data,token){

    var url = getConfig('host')+getConfig('root')+"/invitations/admin";
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "POST",
            headers : {
                "ct-auth-token": token, 
            },
            data : {
                email : data
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function getchurchAdminMember(token){
    var url = getConfig('host')+getConfig('root')+"/invitations/admin/all";
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token, 
            }
        };
        xhttp(input).then((resp) =>{
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function cancelInvitation(token,invitationId){
    var url = getConfig('host')+getConfig('root')+"/invitations/admin";
    return new Promise((resolve,reject) => {
        var input = {
            url : url,
            method : "DELETE",
            headers : {
                "ct-auth-token": token, 
            },
            data : {
                invitationId : invitationId
            }
        };
        xhttp(input).then((resp) =>{
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}