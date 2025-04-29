import jwt from 'jsonwebtoken';

export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Authorization header missing');
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Token missing');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
}