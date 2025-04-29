import { Router } from 'express';
import { signUp, signIn } from '../controllers/auth.controller.js';
import { signUpSchema, signInSchema } from '../schemas/auth.schema.js';
import { validateSchema } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/sign-up', validateSchema(signUpSchema), signUp);
router.post('/sign-in', validateSchema(signInSchema), signIn);

export default router;