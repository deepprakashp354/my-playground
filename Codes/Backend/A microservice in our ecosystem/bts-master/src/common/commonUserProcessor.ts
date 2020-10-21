import { HttpExecutor } from 'ct-http';
import { AppConfig } from 'ct-app-config';


const xhttp = new HttpExecutor();
const appConfig = new AppConfig();


export class CommonUserProcessor {

    getUserData(userId: any) {
        return new Promise((resolve, reject) => {
            const userApiConfig = appConfig.getConfig("apis:userProfile:get");

            const options = {
                "url": userApiConfig.url+"?_id="+userId,
                "method": userApiConfig.method,
                "headers": userApiConfig.headers,
                "json": true
            }
            xhttp.execute(options).then((userArrayData: any) => {
                if (!userArrayData || userArrayData.length == 0) {
                    resolve({"error": "user-not-found", "message": "FATAL ERROR: USER NOT FOUND"})
                }
                var Data = JSON.parse(userArrayData);
                resolve(Data);
            }).catch((error:any) => {
                reject(error)
            })
        })
    }

}
