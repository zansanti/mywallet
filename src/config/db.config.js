import { MongoClient } from 'mongodb';

let db = null;
const mongoClient = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log('Connected to MongoDB');
} catch (error) {
    console.log('Error connecting to MongoDB', error);
}

export default db;