import express from 'express';
import { createPaymentController } from '../controllers/paymentController.js';
const router = express.Router();

router.post('/create-payment', createPaymentController);

export default router;
