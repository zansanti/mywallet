import Joi from 'joi';

export const transactionSchema = Joi.object({
    value: Joi.number().positive().required(),
    description: Joi.string().required(),
    type: Joi.string().valid('deposit', 'withdraw').required()
});