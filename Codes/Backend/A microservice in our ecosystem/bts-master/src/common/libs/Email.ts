import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

export class Email {
    private config:any = null;
    private transporter:any = null;
    private mailOptions:any = null;
    private templateDir:string = path.resolve('./src/Users/templates/');
    private templatePath:any = null;

    // connect
    connect(config:any){
        // host : "smtp.gmail.com",
        // port : 465,
        // secure : true,
        // user : "deepprakashp354@gmail.com",
        // pass : "xxxxxxx"

        //        or

        // user : "deepprakashp354@gmail.com",
        // pass : "xxxxxxx"
        // service: 'gmail',

        // config
        this.config = config;
        // transporter
        this.transporter = nodemailer.createTransport(this.config);

        return this;
    }

    // options
    options(mailOptions:any){
        // from: '"Deep Prakash" <deepprakashp354@gmail.com>',
        // to: "deepprakashp354@gmail.com",
        // subject: "Test Email",
        // text: "Testing this email with node mailer",
        // html: '<b>Hell World!</b>'

        this.mailOptions = mailOptions;
        return this;
    }

    // template
    template(templateId:string){
        this.templatePath = this.templateDir+"/"+templateId+"/html.ejs";
        return this;
    }

    // send email
    send(data:any = {}, opt:any = {}){
        return new Promise((resolve:any, reject:any) => {
            // with template
            if(this.templatePath !== null){
                // render template
                ejs.renderFile(this.templatePath, data, opt, (err, str) => {
                    if(!err){
                        this.mailOptions.html= str;

                        // sendmail
                        this.sendMail().then((result:any) => {
                            resolve(result);
                        }).catch((error:any) => {
                            reject(error);
                        })
                    }
                    else reject(err);
                });
            }
            // plain
            else{
                this.sendMail().then((result:any) => {
                    resolve(result)
                }).catch((error:any) => {
                    reject(error);
                })
            }
        })
    }

    // send mail
    sendMail(){
        return new Promise((resolve:any, reject:any) => {
            if(!this.mailOptions && !this.transporter) reject("error!");
            else {
                this.transporter.sendMail(this.mailOptions, (error:any, info:any) => {
                    if (error) reject(error);
                    else resolve(info);
                });
            }
        })
    }

    // reset options
    reset(){
        this.config = null;
        this.transporter = null;
        this.mailOptions = null;
    }
}