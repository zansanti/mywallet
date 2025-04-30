import { getDB } from '../config/db.config.js';
import { ObjectId } from 'mongodb';

export async function createTransaction(req, res) {
    const { value, description, type } = req.body;
    const { userId } = res.locals;
    
    try {
        const db = getDB();
        const transactionsCollection = db.collection('transactions');
        
        // Validação adicional do tipo
        if (!['deposit', 'withdraw'].includes(type)) {
            return res.status(422).json({ error: 'Invalid transaction type' });
        }

        await transactionsCollection.insertOne({
            userId: new ObjectId(userId), // Garante que o userId está no formato correto
            value: parseFloat(value), // Garante que é float
            description,
            type,
            date: new Date(),
            updatedAt: new Date() // Adiciona timestamp de criação
        });
        
        return res.status(201).json({ message: 'Transaction created successfully' });
    } catch (error) {
        console.error('CreateTransaction Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTransactions(req, res) {
    const { userId } = res.locals;
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
        return res.status(400).json({ error: 'Page must be a positive number' });
    }
    
    try {
        const db = getDB();
        const transactionsCollection = db.collection('transactions');
        
        const transactions = await transactionsCollection
            .find({ userId: new ObjectId(userId) })
            .sort({ date: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .toArray();
            
        // Adiciona contagem total para paginação no front
        const totalCount = await transactionsCollection.countDocuments({ userId: new ObjectId(userId) });
        
        return res.json({
            transactions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / 10),
                totalTransactions: totalCount
            }
        });
    } catch (error) {
        console.error('GetTransactions Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateTransaction(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    const { value, description, type } = req.body;
    
    try {
        const db = getDB();
        const transactionsCollection = db.collection('transactions');
        
        // Verifica se a transação existe e pertence ao usuário
        const transaction = await transactionsCollection.findOne({ 
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }
        
        await transactionsCollection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    value: parseFloat(value),
                    description,
                    type,
                    updatedAt: new Date() // Atualiza o timestamp
                } 
            }
        );
        
        return res.sendStatus(204);
    } catch (error) {
        console.error('UpdateTransaction Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteTransaction(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;
    
    try {
        const db = getDB();
        const transactionsCollection = db.collection('transactions');
        
        // Verifica existência e permissão numa única query
        const deleteResult = await transactionsCollection.deleteOne({ 
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });
        
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }
        
        return res.sendStatus(204);
    } catch (error) {
        console.error('DeleteTransaction Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}