import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/db.config.js';

export async function signUp(req, res) {
    const { name, email, password } = req.body;
    
    try {
        const db = getDB();  // Obtemos a conexão com o DB
        const usersCollection = db.collection('users');
        
        // Check if user already exists
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
            return res.status(409).send('Email already registered');
        }
        
        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Insert user
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()  // Adicionamos timestamp
        });
        
        return res.sendStatus(201);
    } catch (error) {
        console.error('SignUp Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;
    
    try {
        const db = getDB();  // Obtemos a conexão com o DB
        const usersCollection = db.collection('users');
        
        // Find user
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }
        
        // Check password
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // Generate token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email  // Adicionamos mais dados ao payload
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        return res.json({ 
            token,
            user: {  // Retornamos algumas informações do usuário
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('SignIn Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}