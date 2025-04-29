import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { transactionSchema } from '../schemas/transaction.schema.js';
import { 
    createTransaction, 
    getTransactions, 
    updateTransaction, 
    deleteTransaction 
} from '../controllers/transactions.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/transactions', validateSchema(transactionSchema), createTransaction);
router.get('/transactions', getTransactions);
router.put('/transactions/:id', validateSchema(transactionSchema), updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;