import xhttp from './../libs/network';
import { getConfig } from './../AppConfig';

export function getProfileData(token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/profile";
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

//uploading profile pic
export function uploadProfilePic(data, token){
    var formData = new FormData();
    formData.append('file', data[0])

    return new Promise ((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/upload/profilepic"
        var input = {
            url: url,
            method: 'POST',
            data: formData,
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

//uploading cover pic
export function uploadCoverPic(data, token){
    return new Promise((resolve, reject) => {
        var files = new FormData();
        files.append('file', data[0]);

        var url = getConfig('host')+getConfig('root')+"/user/upload/coverpic";
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

//for updating address details
export function putContactData(address,token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/profile";
        var input = {
            url : url,
            method : "PUT",
            data : {
                "address" : address
            },
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

//for updating phone number
export function postPhoneData(obj, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/address/details";
        var input = {
            url: url,
            method : "PUT",
            data : obj,
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            }
        };
        xhttp(input).then((resp) => {
            // getProfileData(token)
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

//for otp generate
export function generateOtp(obj, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/send/otp/phone/verify";
        var input = {
            url: url,
            method : "PUT",
            data : {
                "otp" : obj
            },
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
//for updating personal details
export function updatePersonalData(data, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/profile";
        var input = {
            url: url,
            method: 'PUT',
            headers : {
                "ct-auth-token": token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {
            // getProfileData(token)
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

//for requesting join family
export function updatePersonalDataRequest(data, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/familyRequest";
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
            // getProfileData(token)
            resolve(resp.data)
        }).catch((error) => {
            reject(error);
        })
    })
}

//Auto suggestiosn for professions
export function autoSuggestionProf(data, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/search/skills/suggestions";
        var input = {
            url: url+"?type=profession&skill=" + data,
            method: 'GET',
            headers: {
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

//for getting family members suggestions
export function getFamilyName(name, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/search/user/suggestions";
        var input = {
            url: url+"?name=" + name,
            method: 'GET',
            headers: {
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

//for posting family Data
export function postFamilyData(data, token){
    
    var url = getConfig('host')+getConfig('root')+"/user/profile";
    var files = new FormData();
    Object.keys(data).map((v, k) => {
        var obj = data[v]
        files.append('file' + k, obj)
    })
    return new Promise((resolve, reject) => {
        var input = {
            url: url,
            method: "PUT",
            headers: {
                "ct-auth-token": token,
                'Content-Type': "multipart/form-data"
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

//for deleting family member 
export function deleteFamilyMember(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/profile"; 
        var input = {
            url: url,
            method: "DELETE",
            headers: {
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

//for inviting family member whi are not registered in ant church
export function inviteFamilyMember(data, token){
    return new Promise((resolve,reject) => {
        var url = getConfig('host')+getConfig('root')+"/invitations/family";
        var input = {
            url: url,
            method: 'POST',
            headers: {
                "ct-auth-token": token,
                "Content-Type": 'application/json'
            },
            data: data
        };
        xhttp(input).then((resp) => {
            resolve(resp.data)
        }).catch((err) => {
            reject(err);
        })
    })
}
//for posting life events
export function addLifeEvents(obj, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/lifeEvents"
		var input = {
			url: url,
			method: 'POST',
			data: obj,
			headers: {
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

//for getting life events
export function getLifeEvents(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/lifeEvents";
        var input = {
            url: url,
            method: "GET",
            data: data,
            headers: {
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

export function deleteLifeEvents(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/lifeEvents";
        var input = {
            url: url,
            method: "DELETE",
            data: data,
            headers: {
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

//elastic search for skills
export function searchSkillData(keySkills, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/search/skills/suggestions";
        var input = {
            url : url+'?type=skill&skill=' + keySkills,
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

//adding a skill
export function postSkill(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/skills";
        var input = {
            url: url,
            method: 'POST',
            headers: {
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

export function removeSkill(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/skills";
        var input = {
            url: url,
            method: 'DELETE',
            headers: {
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

//deleting a skill 
export function deleteSkill(data, token){
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/skills";
        var input = {
            url: url,
            method: 'DELETE',
            headers: {
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

//autosuggestions for volunteer interest
export function searchInterest(newUser, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/search/skills/suggestions";
        var input = {
            url : url+'?type=Volunteer&skill=' + newUser,
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

//post a volunterring interset 
export function postVolunteerInterest(data, token) {
    return new Promise((resolve, reject) => {
        var url = getConfig('host')+getConfig('root')+"/user/skills";
        var input = {
            url : url,
            method : 'POST',
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