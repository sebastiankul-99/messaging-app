
// Import the express in typescript file
import express from 'express';
require('cors')
const bodyParser = require('body-parser');


let corsOptions = {
    origin : ['http://localhost:3000'],
    AllowMethods:     ["GET", "POST"],
    AllowHeaders:     ["Content-Type"],
    ExposeHeaders:    ["Content-Length"],
}
const cors = require('cors')
//mongoose.connect(URI)
//    .then(() => console.log('Connected!')).catch((error)=>{console.log("error while connecting to mongodb: ", error)});
// Initialize the express engine
import {dbClient, chatCollection} from "./database";

const app: express.Application = express();

app.use(cors(corsOptions))
app.use(express.json())
// Take a port 3000 for running server.
const port: number = 6020;
 
// Handling '/' Request
app.get('/user/:id', (req, res) => {
    const userId:string = req.params['id']
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)

    console.log(userId)
    chatCollection.find({"participants.id" : userId}, { projection: { _id: 0 } }).toArray().then((array)=>{
        res.send(array);
        }).catch()
});
app.post('/chat/', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    console.log("req:",req.body)
    chatCollection.insertOne(
        req.body
    ).then(() => (res.send('done'))).catch(()=>{res.send('done')})
});
app.post('/message/', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    const body = req.body;
    const chatId = body["chatId"]
    const message = body['message']
    console.log("chat id ", chatId)
    console.log("message ", message)
    chatCollection.updateOne({id:chatId},{$push: {
        messages: message
        }}).then(() => (res.send('done'))).catch(()=>{res.send('done')})
});
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});
