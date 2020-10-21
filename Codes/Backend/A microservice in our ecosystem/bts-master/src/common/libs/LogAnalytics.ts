import { Logger } from 'ct-logger';
import * as _ from 'lodash';

export class LogAnalytics{
    constructor(){
        this.init();
    }

    // logger
    public logger:any = Logger.Instance;
    // availble types
    public logTypes:any = ["info", "error", "debug"];

    // log data
    public logData:any = {
        type :  "info",
        message : null,
        event : null,
        subEvent : null,
        data : null
    };

    // initialize log varible
    public init:any;

    // error builder
    public error:any;
    // event
    public event:any;
    // subevent
    public subEvent:any;
    // message
    public message:any;
    // info builder
    public info:any;
    // debug builder
    public debug:any;

    // log creator
    public putLog:any;

    // processors
    // series logger
    public logSeries(data:any, keys:any){
        // loop
        if(typeof data == "object")
            data.map((v:any, k:any) => {
                var logData = Object.assign({}, this.logData);
                var logObj = this.getValueFromKey(v, keys);
                logData.data = logObj;
                delete logData.type;
                delete logData.message;

                this.logger[this.logData.type](logData, this.logData.message)
            })
    }

    // individual logger
    public logOne(data:any){
        this.logData.data = data;
        // check if log prepared
        if(this.logTypes.indexOf(this.logData.type) !== -1 && this.logData.event !== null){
            var data:any = Object.assign({}, this.logData);
            delete data.type;
            delete data.message;

            this.logger[this.logData.type](data, this.logData.message)
        }
    }

    // get value from key
    public getValueFromKey(val:any, keys:any){
        var obj:any = {};
        keys.map((v:any, k:any) => {
            if(v.indexOf(".") == -1)
                obj[v] = val[v]
            else obj[v.slice(v.lastIndexOf(".") + 1, v.length)] = _.get(val, v);
        })

        return obj;
    }
}

// error builder
LogAnalytics.prototype.error = function(message:any):any{
    this.logData.type = "error";
    this.logData.message = message;

    return this;
}

// event builder
LogAnalytics.prototype.event = function(event:string):any{
    this.logData.event = event;

    return this;
}

LogAnalytics.prototype.subEvent = function(e:string):any{
    this.logData.subEvent = e;

    return this;
}

// message builder
LogAnalytics.prototype.message = function(message:any):any{
    this.logData.message = message;

    return this;
}

// info builder
LogAnalytics.prototype.info = function(message:string):any{
    this.logData.type = "info";
    this.logData.message = message;

    return this;
}

// debug builder
LogAnalytics.prototype.debug = function(message:string):any{
    this.logData.type = "debug";
    this.logData.message = message;

    return this;
}

// log creator
LogAnalytics.prototype.putLog = function(data:any=null, keys:any=null):any{
    // log one if key == null
    if(keys == null) this.logOne(data);
    // log multiple in series if key !== null
    else this.logSeries(data, keys);

    // clean log variable
    this.init()
}

// intialize log variable
LogAnalytics.prototype.init = function():any{
    this.logData = {
        type : "info",
        message : null,
        event : null,
        subEvent : null,
        data : null
    };

    return this;
}
