import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.DATABASE_URL, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 20000,
  family: 4, // Força IPv4
  tls: true,
  tlsAllowInvalidCertificates: false
});

let db;

export async function connectDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log('✅ MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}