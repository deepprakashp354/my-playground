import { BugTrackerProcessor } from './../processors/BugTrackerProcessor';

const bugTrackerProcessor = new BugTrackerProcessor();

export class BugTrackerApiInterface {
    interface(req:any){
        return new Promise((resolve:any, reject:any) => {
            switch(req.method){
                case "GET" : {
                    // process get request
                    bugTrackerProcessor.get(req).then((result:any) => {
                        resolve(result);
                    }).catch((error) => {
                        reject(error);
                    })
                    
                    break;
                }
    
                case "POST" : {
                    // process create request
                    bugTrackerProcessor.create(req.body, req.user).then((result:any) => {
                        resolve(result);
                    }).catch((error:any) => {
                        reject(error);
                    })

                    break;
                }
    
                case "PUT" : {
                    // process update request
                    bugTrackerProcessor.update(req.body, req.user).then((result:any) => {
                        resolve(result);
                    }).catch((error:any) => {
                        reject(error);
                    })
                    break;
                }

                default : resolve("error");
            }
        })
    }
}