const { saveUser } = require('./../config/db');

const users = [];

// Join new user in users array
function joinUser(id, userName, roomName){

    const user = { id, userName, roomName };

    users.push(user);

    saveUser(user);

    return user;
}

// Get user by Id
function getUserById(id){

    return users.find(user => user.id == id);
}

// Leave the user
function userLeave(id){
    const index = users.findIndex(user => user.id == id);

    if(index != -1){
        return users.splice(index, 1)[0];
    }
}

// Get the user room
function getUserListForRoom(roomName){

    return users.filter(user => user.roomName == roomName);
}

module.exports = {
    joinUser,
    getUserById,
    userLeave,
    getUserListForRoom
}