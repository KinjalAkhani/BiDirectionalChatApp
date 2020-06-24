const path = require('path'); // node base module for project file access
const http = require('http'); // http server required by express for socket io
const express = require('express'); // express server
const socketio = require('socket.io'); // socketio constant variable
const moment = require('moment');

const formatMessage = require('./utils/message');
const { joinUser, getUserById, userLeave, getUserListForRoom } = require('./utils/users');
const { connectDB, saveUserMessage } = require('./config/db');

const app = express(); // created an app constant which is having express server access 
const server = http.createServer(app) // server variable for express http server
const io = socketio(server); // creates http server socketio object

// Connect MongoDB database
connectDB();

// set public folder as static folder 
app.use(express.static(path.join(__dirname, 'public')));

const chatBotName = "Streebo Chatbot";

// Run when clients try to connect to server
io.on('connection', (socket) => {

    //console.log('New WS connections...');
    // Client/User joins chat room
    socket.on('joinChatRoom', ({userName, roomName}) => {
            
        const user = joinUser(socket.id, userName, roomName);

        socket.join(user.roomName);

        // send message to single client who requested for new connection
        socket.emit('message', formatMessage(chatBotName, 'Welcome to Chat Room'));

        // send broadcast message to all other users when new user connects 
        socket.broadcast.to(user.roomName).emit('message', 
                    formatMessage(chatBotName, `${userName} joined the chat room`));
        
        io.to(user.roomName).emit('userRoom', {
            roomName: user.roomName,
            users: getUserListForRoom(user.roomName)
        });

    });
    
    // Client sends chat message to server
    socket.on('chatMessage', (message) => {
        
        //console.log(message);
        const user = getUserById(socket.id);

        console.log('user chet :: ', user);
        let currTime = moment().format('h:mm a');
        saveUserMessage(socket.id, user.userName, user.roomName, message, currTime);
        // send this message to every users
        io.to(user.roomName).emit('message', formatMessage(user.userName, message, currTime));
    });

    // Runs when client disconnect
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user){

            // send broadcast message to all the users existing and new join user
            io.to(user.roomName).emit('message', formatMessage(chatBotName, 
                `${user.userName} has left the chat conversation`));

            io.to(user.roomName).emit('userRoom', {
                roomName: user.roomName,
                users: getUserListForRoom(user.roomName)
            });
        }
    });

});

const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port # ${PORT}`));
