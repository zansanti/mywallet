import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.config.js';

export async function signUp(req, res) {
    const { name, email, password } = req.body;
    
    try {
        // Check if user already exists
        const userExists = await db.collection('users').findOne({ email });
        if (userExists) return res.status(409).send('Email already registered');
        
        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Insert user
        await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword
        });
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;
    
    try {
        // Find user
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(404).send('Email not found');
        
        // Check password
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).send('Invalid password');
        
        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.send({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}