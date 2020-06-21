const userMessages = [];

// Join new user in users array
function addUserMsg(user, message, time){

    const userMsg = { user['id'], user['userName'], user[roomName], message, time };

    userMessages.push(user);

    saveUser(user);
}