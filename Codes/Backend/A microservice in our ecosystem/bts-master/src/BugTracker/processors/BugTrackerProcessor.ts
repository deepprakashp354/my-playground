import { HttpExecutor } from 'ct-http';
import { AppConfig } from 'ct-app-config';
import * as shortid from 'shortid';
import { CommonUserProcessor } from './../../common/commonUserProcessor';
import CommongBugProcessor from './../common/CommonBugProcessor';

const xhttp = new HttpExecutor();
const appConfig = new AppConfig();
const commonUserProcessor = new CommonUserProcessor();

export class BugTrackerProcessor extends CommongBugProcessor{
    // create bugs processor
    create(query:any, user:any){
        return new Promise((resolve:any, reject:any) => {
            var bugAppConfig = appConfig.getConfig('apis:createBugs');
            var bugId = shortid.generate();
            var createdBy = user._id;

            
            var bug = Object.assign({}, query);
            bug.createdBy = createdBy;
            bug.bugId = bugId;

            let options = {
                url : bugAppConfig.url,
                method : bugAppConfig.method,
                headers : bugAppConfig.headers,
                body : bug,
                isJson : true
            }

            xhttp.execute(options).then((result:any) => {            
	    	resolve(result);

                commonUserProcessor.getUserData(createdBy).then((userData:any) =>{
		    if(userData.length !=0 ){

                        result["name"] = userData[0].name
                        result["churchName"] = userData[0].churches[0].churchId.name

			super.notifyBugCreation(result, user);
		    }
		}).catch((error)=>{
                    reject(error)
                })
            }).catch((error:any) => {
                reject(error);
            })
        })
    }
    // get bugs
    get(req:any){
        return new Promise((resolve:any, reject:any) => {
            var superAdmin = appConfig.getConfig('SUPER_ADMIN:EMAIL');
            var bugAppConfig = appConfig.getConfig('apis:getBugs');
            var user = req.user;

            var query:any = {};
            // if specific bug id is queried
            if(req.query.hasOwnProperty('bugId')){
                query.bugId = req.query.bugId;
            }

            // su gets all the bugs and user gets his bugs
            if(superAdmin.indexOf(user.email) == -1){
                query.createdBy = user._id;
            }

            let options = {
                url : bugAppConfig.url+"populate",
                method : bugAppConfig.method,
                headers : bugAppConfig.headers,
                qs : query,
                isJson : true
            }

            xhttp.execute(options).then((result:any) => {
                resolve(result);
            }).catch((error:any) => {
                reject(error);
            })
        })
    }

    // update bugs
    update(query:any, user:any){
        return new Promise((resolve:any, reject:any) => {
            var superAdmin = appConfig.getConfig('SUPER_ADMIN:EMAIL');
            var bugAppConfig = appConfig.getConfig('apis:updateBugs');
            var createdBy = user._id;
            // only su allowed to update status
            if(superAdmin.indexOf(user.email) !== -1){
                var q = {
                    query : {
                        bugId : query.bugId
                    },
                    user : user
                }

                this.get(q).then((bug:any) => {
                    // if not already closed
                    if(bug[0].status !== "Closed"){
                        var qs = {
                            where : {
                                bugId : query.bugId
                            },
                            data : {
                                status : query.status
                            }
                        }
        
                        let options = {
                            url : bugAppConfig.url,
                            method : bugAppConfig.method,
                            headers : bugAppConfig.headers,
                            body : qs,
                            isJson : true
                        }
        
                        xhttp.execute(options).then((result:any) => {
                            var newBug = Object.assign({}, bug[0]);
                            newBug.status = "Closed";
                            resolve(newBug);

                            // notify bug closed
                            if(query.status == "Closed"){

                                commonUserProcessor.getUserData(createdBy).then((userData:any) =>{
                                    if(userData.length !=0 ){
                
                                        result["name"] = userData[0].name
                                        result["churchName"] = userData[0].churches[0].churchId.name

					                    super.notifyBugClose(newBug, user);
                                        
				                    }
                                }).catch((error)=>{
                                    reject(error)
                                })
                            }
                        }).catch((error:any) => {
                            reject(error);
                        })
                    }
                    else{
                        resolve({code : "BUG_ALREADY_CLOSED", message : "You cannot change the status of bug which is already closed!"})
                    }
                }).catch((error:any) => {
                    reject(error);
                })
            }
            else{
                reject({
                    code : 401
                })
            }
        })
    }
}
