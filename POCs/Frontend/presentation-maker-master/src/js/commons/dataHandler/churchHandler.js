import xhttp from './../libs/network';
import { getConfig } from './../AppConfig';

export function updateUserGroupsMem(data) {
    console.log("update user group",data)
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/check/updateUserGroup";

        var input = {
            url : url,
            method : "PUT",
            headers : {
                'Content-Type': 'application/json'
            },
            data : data
        };
        xhttp(input).then((resp) => {

            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function updateUserGroupsChurch(data) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/check/updateUserGroup";
        
        var input = {
            url : url,
            method : "PUT",
            headers : {
                'Content-Type': 'application/json'
            },
            data : data
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function createChurchData(token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/church";
        
        var input = {
            url : url,
            method : "POST",
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function getChurchProData(token, churchId) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/church";
        var input = {
            url: getConfig('host')+getConfig('root')+'/church?_id='+churchId,
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

export function updateChurchData(data, churchId, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church?_id='+churchId,
            method: 'PUT',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function updateChurchEmailData(data, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church/secondaryEmail',
            method: 'POST',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function updateMinistryData(data, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church/ministries',
            method: 'POST',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {

            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function deleteMinistryData(data, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church/ministries',
            method: 'DELETE',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {

            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function deleteServiceData(data, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church/service',
            method: 'DELETE',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {

            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}


export function updateStaffData(data, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church/members',
            method: 'POST',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {

            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function deleteStaffData(data, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church/members',
            method: 'DELETE',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {

            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}


export function inviteStaffData(data, token) {
    var url = getConfig('host')+getConfig('root')+'/invitations/staff';
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: 'POST',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}


export function updateChurchTimingData(data, churchId, token) {
    return new Promise((resolve, reject) => {
        var input = {
            url: getConfig('host')+getConfig('root')+'/church?_id='+churchId,
            method: 'PUT',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
            
           
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}


export function updateChurchServiceData(data, token) {
    let information = data.day;
    return new Promise((resolve, reject) => {

        var input = {
            url: getConfig('host')+getConfig('root')+'/church/service',
            method: 'POST',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {

            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}



//Church customer
export function getCustomerData(){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/group/update";

        var input = {
            url : url,
            method : "POST",
            headers : {
                'content-Type' : 'application/json'
            },
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function fetchTransaction(){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/group/update";

        var input = {
            url : url,
            method : "",
            headers : {
                'content-Type' : 'application/json'
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}
export function fetchChurchList(token){
    return new Promise((resolve, reject) => {
    var url = getConfig('host')+getConfig('root')+"/products/church";
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
            reject(error)
        })
    })
}

export function subscribePlanHandler(token, data){
    // console.log("handlerdata", data)
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/pay/church/";
        var input = {
            url : url,
            method : "POST",
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data : data
        };
        
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function fetchPlanHandler(token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/pay/church/";
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
            reject(error)
        })
    })
}

export function makeTransaction(){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/auth/group/update";

        var input = {
            url : url,
            method : "",
            headers : {
                'content-Type' : 'application/json'
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

export function uploadCoverImage(data, token){
    return new Promise((resolve, reject) => {
        var files = new FormData();
        files.append('file', data[0]);
 
        var url = getConfig('host')+getConfig('root')+"/church/upload/coverpic";
        var input = {
            url: url,
            method: 'POST',
            data: files,
            headers: {
                "Content-Type" : "multipart/form-data;boundary=------------------------7d87eceb5520850c", 
                "ct-auth-token": token
            }
        };

        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        }) 
    })
}

export function uploadProfileImage(data, token){
    return new Promise((resolve, reject) => {
        var files = new FormData();
        files.append('file', data[0]);

        var url = getConfig('host')+getConfig('root')+"/church/upload/profilepic";
        var input = {
            url: url,
            method: 'POST',
            data: files,
            headers: {
                "Content-Type" : "multipart/form-data;boundary=------------------------7d87eceb5520850c", 
                "ct-auth-token": token
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        }) 
    })
}


export function searchStaff(churchId, staff, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/search/church/staff/suggestions";
        var input = {
            url : url+'?churchId=' + churchId + '&staff=' + staff,
            method : 'GET',
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

//publish church on churchtalk
export function publishChurch(token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/church/publish";
        var input = {
            url: url,
            method: 'POST',
            headers: {
                'ct-auth-token': token,
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

//unpublish church from churchtalk
export function unpublishChurch(token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/church/unpublish";
        var input = {
            url: url,
            method: 'DELETE',
            headers: {
                'ct-auth-token': token,
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

// Create a new church
// Would like validation to check if user CAN or CAN NOT create a church. Must it be there ?
export function createAChurch(token, data) {
    return new Promise((resolve, reject) => {

        console.log("A CHURCH IS ATTEMPTING TO BE CREATED", token, data);
        const url = getConfig("host") + getConfig("root") + "/church";
        const options = {
            url,
            data,
            method: "POST",
            headers: {
                "ct-auth-token": token
            }
        };

        xhttp(options).then((response) => {
            // Examine the response
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}