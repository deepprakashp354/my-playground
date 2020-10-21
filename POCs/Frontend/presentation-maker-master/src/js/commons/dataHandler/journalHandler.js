import xhttp from './../libs/network';
import { getConfig } from './../AppConfig';

export function getBibleReading(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/bible"

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
            reject(error);
        })
    })
}

export function postBiblePrayer(token,data){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/bible"

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

export function  editBiblePrayer(token,data){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/bible"

        var input = {
            url : url,
            method : "PUT",
            data : data,
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

export function deleteBibleprayer(token,id){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/bible"

        var input = {
            url : url,
            method : "DELETE",
            data : {
                prayer : id,
            },
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

export function getMyPrayer(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/user"

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

export function getChurchPrayerList(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/church"

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

export function getSharedPrayer(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/user/share"

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

export function addUserPrayer(token,data){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/user"

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
            reject(error)
        })
    })
}

export function editUserPrayer(token,data){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/user"

        var input = {
            url : url,
            method : "PUT",
            data : data,
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

export function deleteUserPrayer(token,id){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/user"

        var input = {
            url : url,
            method : "DELETE",
            data : {
                prayer : id,
            },
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

export function fetchTag(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/tags"

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

export function searchMember(token,data){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/search/user?name="+data

        var input = {
            url : url,
            method : "GET",
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

export function sharePrayer(data,token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/user/share"

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
            reject(error)
        })
    })
}

export function fetchAdminNewPrayer(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/church/admin/new"

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

export function fetchAdminApprovedPrayer(token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/church"

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

export function approvePrayer(obj,token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/church"

        var input = {
            url : url,
            method : "POST",
            data : obj,
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

export function fetchChurchStaff(token,churchId,name){
    return new Promise((resolve,reject) => {       

        var url = getConfig('host')+getConfig('root')+"/search/church/staff/suggestions?churchId=+"+churchId+"&staff="+name;
        var input = {
            url : url,
            method :  "GET",
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

export function answeredPrayer(data,token){
    return new Promise((resolve,reject) => {

        var url = getConfig('host')+getConfig('root')+"/prayers/user"
        var input = {
            url : url,
            method : "PUT",
            data : data,
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

export  function sendPrayerWithdrawRequest(token, prayerId){
    return new Promise((resolve,reject) => {
         
        var url = getConfig('host')+getConfig('root')+"/prayers/withdraw/user"

        var input = {
            url : url,
            method : "POST",
            data : {
                prayerId : prayerId
            },
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

export function acceptWithdrawRequest(token,id){
    return new Promise((resolve,reject) => {

        var url = getConfig('host')+getConfig('root')+"/prayers/withdraw/user"

        var input = {
            url : url,
            method : "DELETE",
            data : {
            requestedId : id
            },
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

export function acceptFamilyRequest(obj,token){
    return new Promise((resolve,reject) => {

        var url = getConfig('host')+getConfig('root')+"/user/familyRequest"

        var input = {
            url : url,
            method : "PUT",
            data : obj,
            headers : {
                "ct-auth-token": token,
                "content-type": 'application/json',
            }
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function declineWithdraw(token,id){
    return new Promise((resolve,reject) => {

        var url = getConfig('host')+getConfig('root')+"/prayers/withdraw/user"
        var input = {
            url : url,
            method : "PUT",
            data : {
            requestedId : id
            },
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

export function declineFamilyWithdraw(token,id){
    return new Promise((resolve,reject) => {

        var url = getConfig('host')+getConfig('root')+"/user/familyRequest"
        var input = {
            url : url,
            method : "DELETE",
            data : {
            requestedId : id
            },
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

//filter

export function filter(token,value){
    return new Promise((resolve,reject) => {

        if(value === "ANSWERED"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user?answered=true"   
        }
        else if (value === "UNANSWERED"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user?answere=false"   
        }
        else if (value === "OLDEST"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user?sort=true"  
        }
        else if (value === "JOB"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user/job"   
        }
        else if (value === "CHURCH"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user/church"   
        }
        else if(value === "FAMILY"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user/family"   
        }
        else if (value === "HEALTH"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user/health"   
        }
        else if (value === "OTHERS"){
            var url = getConfig('host')+getConfig('root')+"/prayers/user/others"   
        }
        // else if (value == "SHAREFAMILY"){
        //     var url = getConfig('host')+getConfig('root')+"/prayers/user/all/family"   
        // }
        // else if (value == "SHARECHURCH"){
        //     var url = getConfig('host')+getConfig('root')+"/prayers/user/all/church"   
        // }

        
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

export function filterchurchPrayer(token,value){
    return new Promise((resolve,reject) => {

        if(value === "ANSWERED"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?answered=true"   
        }
        // else if (value === "UNANSWERED"){
        //     var url = getConfig('host')+getConfig('root')+"/prayers/church?answere=false"   
        // }
        else if (value === "OLDEST"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?sort=true"  
        }
        else if (value === "JOB"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?tags=job"   
        }
        else if (value === "CHURCH"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?tags=church"   
        }
        else if(value === "FAMILY"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?tags=family"   
        }
        else if (value === "HEALTH"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?tags=health"   
        }
        else if (value === "OTHERS"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?tags=others"   
        }
        // else if (value === "SHAREFAMILY"){
        //     var url = getConfig('host')+getConfig('root')+"/prayers/church/all/family"   
        // }
        // else if (value == "SHARECHURCH"){
        //     var url = getConfig('host')+getConfig('root')+"/prayers/church/all/church"   
        // }

        
        var input = {
            url : url,
            method : "GET",
            headers : {
                "ct-auth-token": token,
            }
        };
        xhttp(input).then((resp) => {
            // console.log("input for prayer is",input)
            resolve(resp.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function newPrayerfilter(token,value){
    return new Promise((resolve,reject) => {

        if (value === "OLDEST"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church/admin/new?sort=true"  
        }
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

export function approvePrayerfilter(token,value){
    return new Promise((resolve,reject) => {

        if (value === "OLDEST"){
            var url = getConfig('host')+getConfig('root')+"/prayers/church?sort=true"  
        }
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

export function filterByOldestBible(token,value){
    return new Promise((resolve,reject) => {

        if(value === "OLDEST"){
            var url = getConfig('host')+getConfig('root')+"/prayers/bible?sort=true"  
        }
        
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

 export function seeAllPrayer(token,createdBy,status){
     return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/prayers/filter?createdBy="+createdBy+"&status="+status 
         
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

export function seeAllAdminPrayer(token,createdBy,status){
    return new Promise((resolve,reject) => {
       var url = getConfig('host')+getConfig('root')+"/prayers/filter?createdBy="+createdBy+"&status="+status 
        
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