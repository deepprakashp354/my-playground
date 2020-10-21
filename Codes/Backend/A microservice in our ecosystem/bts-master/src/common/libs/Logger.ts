import * as bunyan from 'bunyan';
import { FATAL, ERROR, WARN, INFO, DEBUG, TRACE } from 'bunyan';
var RotatingFileStream = require('bunyan-rotating-file-stream');
let pathLib = require('path');
let mkdirp = require('mkdirp');

let FILE_LOG_LEVEL = process.env.FILE_LOG_LEVEL || 'INFO';
let LOG_FILES_COUNT = Number(process.env.LOG_FILES_COUNT) || 10;
let LOG_RETENTION = process.env.LOG_RETENTION || '1d';
let LOG_DIR = process.env.LOG_DIR || process.cwd() + '/logs';
let LOG_FILE_NAME = process.env.APP_NAME ? LOG_DIR + "/" + process.env.APP_NAME + ".log" : LOG_DIR + "/app.log";
let LOGGER_NAME = process.env.APP_NAME || 'default';

let getLoglevel = (inputFromEnv: string | undefined): number => {
    let logLevelFromEnvironment = inputFromEnv;
    if (logLevelFromEnvironment) {
        switch (logLevelFromEnvironment.toUpperCase()) {
            case 'FATAL':
                return FATAL
            case 'ERROR':
                return ERROR
            case 'WARN':
                return WARN
            case 'INFO':
                return INFO
            case 'DEBUG':
                return DEBUG
            case 'TRACE':
                return TRACE
        }
    }

    return INFO;
}

export class Logger {
    private static _instance:Logger

    public static get Instance(){
        return this._instance || (this._instance=new this())
    }

    private FILE_LOGGER:any = bunyan.createLogger({
        name: LOGGER_NAME,
        level: getLoglevel(FILE_LOG_LEVEL),
        streams: [{
            stream:new RotatingFileStream({
                name: LOGGER_NAME,
                period: LOG_RETENTION,
                totalFiles: LOG_FILES_COUNT,
                path: LOG_FILE_NAME,
                localtime: new Date().toString()
            })
        }]
    });

    private constructor() {
        this.createDefaultLogDir(() => {
         
        })
    }

    createDefaultLogDir(cb: () => void) {
        mkdirp(pathLib.join(LOG_DIR), function (err: any) {
            if(err) {
                cb()
                console.log(err);
            }
            cb()
        });
    }

    public info(loginfo: any, message: string) {
        this.FILE_LOGGER.info(loginfo,message)
    }

    public warn(logInfo: any, message: string) {
        this.FILE_LOGGER.warn(logInfo, message);
    }

    public fatal(logInfo: any, message: string) {
        this.FILE_LOGGER.fatal(logInfo, message);
    }

    public debug(logInfo: any, message: string) {
        this.FILE_LOGGER.debug(logInfo, message);
    }

    public error(logInfo: any, message: string) {
        this.FILE_LOGGER.error(logInfo, message);
    }

    public trace(logInfo: any, message: string) {
        this.FILE_LOGGER.trace(logInfo, message);
    }
}