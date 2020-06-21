const mongoose = require('mongoose');
const CONNECTION_URI = 'mongodb+srv://kinjal15:kinjal15@cluster0-h2juj.mongodb.net/Training?retryWrites=true&w=majority' || process.env.MONGO_DB_CON_URI;
const connectDB = async () => {

    const connection = await mongoose.connect(CONNECTION_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB is connected to host: ${connection.connection.host}`);
}

const userSchema = new mongoose.Schema({
    id: String,
    userName: String,
    roomName: String
});

const userModel = mongoose.model('Users', userSchema);

function saveUser(user){

    const userM = new userModel();
    userM.id = user.id;
    userM.userName = user.userName;
    userM.roomName = user.roomName;

    userM.save();

}

const userMsgSchema = new mongoose.Schema({
    id: String,
    userName: String,
    roomName: String,
    message: String,
    time: String
});

const userMsgModel = mongoose.model('UserMessage', userMsgSchema);

function saveUserMessage(userId, userName, roomName, message, time){

    const userMsgM = new userMsgModel();
    userMsgM.id = userId;
    userMsgM.userName = userName;
    userMsgM.roomName = roomName;
    userMsgM.message = message;
    userMsgM.time = time;

    userMsgM.save();

}

module.exports = {
    connectDB,
    saveUser,
    saveUserMessage
};
