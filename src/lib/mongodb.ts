import {
    MongoClient,
    Db
} from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri)
{
    throw new Error('MongoDB URI is missing');
}

let client: MongoClient;
let db: Db;

const MONGODB_DB = process.env.MONGODB_DB || "airline_app_db";

export async function connectToDatabase()
{
    if(client){
        return { client, db};
    }

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(MONGODB_DB);

    console.log("Connected to Database Successfully!");
    return { client, db };
}