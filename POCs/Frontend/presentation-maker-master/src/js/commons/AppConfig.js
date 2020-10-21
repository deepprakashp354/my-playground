import constants from './../../commons/development.json';
// import constants from './../../commons/production.json';
// import constants from './../../commons/demo.json';
// get constants
export function getConfig(key){
    if(key.indexOf(":") !== -1){
        let arr = key.split(":");
        let value = null;
        arr.map((v, k) => {
            if(k === 0)
                value = constants[v]
            else    
                value = value[v];
        })

        return value;
    }
    else
        return constants[key];
}