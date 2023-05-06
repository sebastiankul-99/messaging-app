import express from 'express';
// Initialize the express engine
const app: express.Application = express();

// Take a port 3000 for running server.
const port: number = 4000;

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    lastTimeOnline?: Date
}

type Chat = {
    id: string
    participants: Array<string>
}

type Message = {
    id: string,
    chat: Chat,
    sender: User
    text: string,
    timestamp: Date
}


const server = app.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})
io.on("connection", (socket:any)=> {
    socket.on('setup', (userData:any) => {
        socket.join(userData.id)
        console.log("user joined id = ",userData.id)
    })
    socket.on('join-chat', (room:string) => {
        socket.join(room)
        console.log("chat id = ",room)
    })
    socket.on('new-message', (message:Message) =>{
        const chat = message.chat
        if (!chat.participants) {
            console.log("no users in chat: ", chat.id)
            return
        }
        chat.participants.forEach(user =>{
            if(user !== message.sender.id) {
                socket.in(user).emit("message-received",message)
                console.log("sending to: ", user)
            }
        })

    })
})

// Server setup
