const socket = io();

const chatMsgForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomNm = document.getElementById('roomName');
const roomUserList = document.getElementById('roomUsers');

// Get username and roomname from URL
const { userName, roomName } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//console.log(userName,roomName);

// When user joins chatroom
socket.emit('joinChatRoom', {userName, roomName});

// Get the message from server
socket.on('message', (message) => {
    console.log(message);

    outputMsgOnDom(message);
    
    // Scroll down to latest chat message
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('userRoom', ({roomName, users}) => {

    outputRoomName(roomName); // To show RoomName which user blongs
    outputRoomUsers(users); // To show all the active users in room

});

chatMsgForm.addEventListener('submit', (e) => {

    e.preventDefault();

    // Get the message from text input from form
    const message = e.target.elements.message.value;

    // Emit/Send message to server
    socket.emit('chatMessage',message);

    // clear message text and set it in focus
    e.target.elements.message.value = '';
    e.target.elements.message.focus();
});

// Output message on DOM
function outputMsgOnDom(message){
    const div = document.createElement('div');

    div.classList.add('message');

    div.innerHTML = `<div>
                        <p class="metaInfo">${message.userName}: ${message.time}</p>
                        <p class="chat"> ${message.textMsg}</p>
                    </div>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// To show RoomName which user blongs
function outputRoomName(userRoom){
    roomNm.innerText = userRoom;
}
// To show all the active users in room
function outputRoomUsers(users){

    roomUserList.innerHTML = `
    ${users.map(user => `<li>${user.userName}</li>`).join('')}
    `;
}