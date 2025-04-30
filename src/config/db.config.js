import { MongoClient } from 'mongodb';

let db = null;

export async function connectDB() {
    try {
        const mongoClient = new MongoClient(process.env.DATABASE_URL);
        await mongoClient.connect();
        db = mongoClient.db();
        console.log('✅ MongoDB connected successfully');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

// Adicione esta função para exportar o db
export function getDB() {
    if (!db) throw new Error('Database not initialized');
    return db;
}

// Exporte o db diretamente também para compatibilidade
export default db;