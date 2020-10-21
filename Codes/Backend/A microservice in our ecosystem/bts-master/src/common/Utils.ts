// convert date
export function convertDate(datestring){
    var d = new Date(datestring);
    var day:any = d.getDate();
    day = day.toString().length == 1 ? "0"+day : day;
    var month:any = d.getMonth() + 1;
    month = month.toString().length == 1 ? "0"+month : month;
    var year = d.getFullYear();

    var min:any = d.getMinutes();
    min = min.toString().length == 1 ? "0"+min : min;
    var hr:any = d.getHours();
    hr = hr.toString().length == 1 ? "0"+hr : hr

    var time = hr+":"+min+":00";
    var time12Hrs = convertTo12Hours(time);
    var formateddate = year+"/"+month+"/"+day;

    return [
        formateddate,
        time12Hrs
    ];
}

// convert to 12 hrs
export function convertTo12Hours(time){
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        time = time.slice (1);
        time[5] = +time[0] < 12 ? ' AM' : ' PM';
        time[0] = +time[0] % 12 || 12;
    }

    return time.join ('');
}

// unique elements
export function getUniqueElement(arr){
    var unique = [];
    arr.map((v, k) => {
        if(unique.indexOf(v) == -1){
            unique.push(v);
        }
    })

    return unique;
}