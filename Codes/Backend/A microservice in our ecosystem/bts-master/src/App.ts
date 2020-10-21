import * as express from "express";
import * as bodyParser from "body-parser";
import { Auth } from 'ct-auth';

// Apps
import * as BugTracker from './BugTracker/index';

const auth = new Auth();
// apps
const bugTracker = new BugTracker.App();

export class App {
    public app:express.Application;
    public router:express.Router;

    constructor() {
        // initialize server
        this.init();
    }

    // configure
    private init():void {
        // get express
        this.app = express();
        this.router = express.Router();

        // configure
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(auth.parser);

        // register routes
        this.registerRoutes();
    }

    // register all the app routes
    private registerRoutes():void {
        // register routes
		this.app.use('/api/bugs', bugTracker.routes());
    }

    // start server
    startServer():void {
        this.app.listen(4000, () => {
            console.log("server started at port 4000");
        })
    }
}