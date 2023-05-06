import {Collection, MongoClient} from "mongodb";


const URI = "mongodb://user:pass@127.0.0.1:27017/?authSource=admin"



const connectToDB =  (uri: string) => {
    const client = new MongoClient(URI);
    client.connect().then(() => console.log("connected")).catch(error => console.log(error));
    return client
}

export const getCollection = (client:MongoClient, dbName:string, collectionName:string) =>{
    const db = client.db(dbName);
    const coll = db.collection(collectionName)
    return coll
}

export const dbClient = connectToDB(URI)
export const chatCollection = getCollection(dbClient, "chatapp","chats")
