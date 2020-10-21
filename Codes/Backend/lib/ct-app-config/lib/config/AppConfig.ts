import * as path from 'path';

export class AppConfig {
    private configFile:any = null;
    private config:any = null;
    
    constructor(){
        this.configFile = process.env.APP_CONFIG;
        // init
        this.init();
    }

    // get config file
    public get getConfigFile(){
        return this.configFile;
    }

    // init
    init(){
        if(this.configFile)
            this.config = require(path.resolve(this.configFile));
    }

    // get configuration
    getConfig(key:string){
        if(!this.config) return null;

        if(key.indexOf(":") !== -1){
            let arr = key.split(":");
            let value:any = null;
            arr.map((v, k) => {
                if(k == 0)
                    value = this.config[v]
                else
                    value = value[v];
            })
    
            return value;
        }
        else
            return this.config[key];
    }
}