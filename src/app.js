import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth.router.js';
import transactionsRouter from './routers/transactions.router.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use(authRouter);
app.use(transactionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});