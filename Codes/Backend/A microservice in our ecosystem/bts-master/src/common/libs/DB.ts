var mongoose = require('mongoose');

export class DB{
    private dbConfig:any;
    private mongooseSchema:any = mongoose.Schema;
    public ObjectId:any = this.mongooseSchema.ObjectId;
    public Types:any = this.mongooseSchema.Types;

    connect = (dbConfig:any) => {
        mongoose.connect('mongodb://'+dbConfig.mongo.host+'/'+dbConfig.mongo.db, { useNewUrlParser: true });
        mongoose.set('useCreateIndex', true);
        
        this.dbConfig = dbConfig;

        // events
        mongoose.connection.on('connected', this.onConnection);   
        mongoose.connection.on('error', this.onError);
        mongoose.connection.on('close', this.onClose);    
    }

    // connection
    onConnection = () => {
        console.log("Mongo db connected.");
    }

    // error
    onError = (mongoError:any) => {
        console.log(new Date() +' @ MongoDB: ERROR connecting to: ' + 'mongodb://'+this.dbConfig.mongo.host+'/'+this.dbConfig.mongo.db + ' - ' + mongoError);
        this.stopProcess();
    }

    // close
    onClose = () => {
        console.log(new Date() +' @ MongoDB: Connection Closed');
        this.stopProcess();
    }

    // stop process
    stopProcess = () => {
        process.exit(0);
    }

    // create schema
    schema = (schemaObj:any) => {
        return this.mongooseSchema(schemaObj);
    }

    // create model
    model = (name:any, schema:any) => {
        return mongoose.model(name, schema);
    }
}
