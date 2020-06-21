const moment = require('moment');

function formatMessage(userName, textMsg){

    return {
        userName,
        textMsg,
        time: moment().format('h:mm a') 
    };
}


function formatMessage(userName, textMsg, time){

    return {
        userName,
        textMsg,
        time 
    };
}

module.exports = formatMessage;