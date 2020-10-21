import { Email } from 'ct-email';
import { AppConfig } from 'ct-app-config';
import { convertDate, getUniqueElement } from './../../common/Utils';

const appConfig = new AppConfig();
const email = new Email();

export default class CommonBugProcessor {
    notifyBugCreation(bug:any, user:any){
        // email bug
        var bugData = Object.assign({}, bug);
        var formatTime = convertDate(bugData.createdAt);
        bugData.time = formatTime[0]+" "+formatTime[1];

        var emailList = appConfig.getConfig("bugNotificationEmails");
        emailList.push(user.email);
        var uniqueEmailList = getUniqueElement(emailList);
        console.log("sending bugs to ", JSON.stringify(uniqueEmailList));
        var emailConfig = appConfig.getConfig("emailConfig");
        uniqueEmailList.map((v:any, k:any) => {
            email.connect(emailConfig)
                .options({
                    from: 'Churchtalk <noreply@churchtalk.services>',
                    to: v,
                    subject: "Bug Tracking System",
                    text: "",
                    html: ""
                })
                .template("BugTrack")
                .send({
                    bugId : bugData.bugId,
                    name : bugData.name,
                    email : user.email,
                    severity : bugData.severity,
                    title : bugData.title,
                    description : bugData.description,
                    status: bugData.status,
                    tag : bugData.tag,
                    time : bugData.time

                })
                .then((emailRes) => {
                    console.log("bug ", emailRes);
                }).catch((error) => {
                    console.log("error ", error);
                })
        })
    }

    // notify bug close
    notifyBugClose(bug, user){
        // email bug closed
        var bugData = Object.assign({}, bug);
        var formatTime = convertDate(bugData.createdAt);
        bugData.time = formatTime[0]+" "+formatTime[1];

        var emailList = appConfig.getConfig("bugNotificationEmails");

        emailList.push(bugData.createdBy.email);
        var uniqueEmailList = getUniqueElement(emailList);
    
        var emailConfig = appConfig.getConfig("emailConfig");
        uniqueEmailList.map((v:any, k:any) => {
            email.connect(emailConfig)
                .options({
                    from: 'Churchtalk <noreply@churchtalk.services>',
                    to: v,
                    subject: "Bug Tracking System",
                    text: "",
                    html: ""
                })
                .template("BugTrackClose")
                .send({
                    bugId : bugData.bugId,
                    name : bugData.createdBy.name,
                    email: bugData.createdBy.email,
                    severity : bugData.severity,
                    title : bugData.title,
                    description : bugData.description,
                    status: bugData.status,
                    tag : bugData.tag,
                    time : bugData.time
                })
                .then((emailRes) => {
                    // console.log("bug ", emailRes);
                }).catch((error) => {
                    console.log("error ", error);
                })
        });    
    }
}
