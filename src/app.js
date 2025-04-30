import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.config.js'; // Importe a função de conexão
import authRouter from './routers/auth.router.js';
import transactionsRouter from './routers/transactions.router.js';

const app = express();
app.use(cors());
app.use(express.json());

// Conecta ao MongoDB antes de iniciar o servidor
connectDB().then(() => {
    // Rotas
    app.use(authRouter);
    app.use(transactionsRouter);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});