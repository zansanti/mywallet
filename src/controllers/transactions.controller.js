import db from '../config/db.config.js';
import { ObjectId } from 'mongodb';

export async function createTransaction(req, res) {
    const { value, description, type } = req.body;
    const { userId } = res.locals;
    
    try {
        await db.collection('transactions').insertOne({
            userId,
            value,
            description,
            type,
            date: new Date()
        });
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getTransactions(req, res) {
    const { userId } = res.locals;
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) return res.status(400).send('Page must be a positive number');
    
    try {
        const transactions = await db.collection('transactions')
            .find({ userId })
            .sort({ date: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .toArray();
            
        res.send(transactions);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateTransaction(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    const { value, description, type } = req.body;
    
    try {
        // Check if transaction belongs to user
        const transaction = await db.collection('transactions').findOne({ _id: new ObjectId(id) });
        if (!transaction) return res.status(404).send('Transaction not found');
        if (transaction.userId !== userId) return res.status(401).send('Unauthorized');
        
        await db.collection('transactions').updateOne(
            { _id: new ObjectId(id) },
            { $set: { value, description, type } }
        );
        
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteTransaction(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    
    try {
        // Check if transaction belongs to user
        const transaction = await db.collection('transactions').findOne({ _id: new ObjectId(id) });
        if (!transaction) return res.status(404).send('Transaction not found');
        if (transaction.userId !== userId) return res.status(401).send('Unauthorized');
        
        await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
        
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}