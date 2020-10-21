import * as express from 'express';
import { Http } from 'ct-response';
import { BugTrackerApiInterface } from './apiInterfaces/BugTrackerApiInterface';

const http = new Http();

const bugTrackerApiInterface = new BugTrackerApiInterface();

export class App {
    private router:express.Router = express.Router();

    // user requests
    bugs(req:any, res:any) {
        var resp = {
            status  : false,
            message : null,
            error : null,
            data : null
        }

        bugTrackerApiInterface.interface(req).then((result:any) => {
            resp.status = true;
            resp.message = "Process Successfully completed!";
            resp.data = result;

            http.response(res).status(200).send(resp.status, resp.message, resp.error, resp.data);
        }).catch((error:any) => {
            if(error.hasOwnProperty("code") && error.code == 401){
                resp.status = false;
                resp.error = "Unauthorized";

                http.response(res).status(401).send(resp.status, resp.message, resp.error, resp.data);
            }
            else{
                resp.status = false;
                resp.message = "Internal Server Error";
                resp.error = error;

                http.response(res).status(500).send(resp.status, resp.message, resp.error, resp.data);
            }
        })
    }

    // routes
    routes(){
        // users
        this.router.get('/:userId?', this.bugs)
                   .post('/', this.bugs)
                   .put('/', this.bugs)
                   .delete('/', this.bugs);

        // return router
        return this.router;
    }
}