import { createRecipient, createPaymentRequest } from '../services/paymentService.js';

export const createPaymentController = async (req, res) => {
  const { amount, recipientId, first_name, last_name, phone_number } = req.body;

  if (!amount || !recipientId) {
    return res.status(400).json({ error: 'Amount and recipient ID are required.' });
  }

  try {
    console.log('🔹 Creating payment with:', { amount, recipientId });

    let recipientResponse;
    if (!recipientId) {
      recipientResponse = await createRecipient(first_name, last_name, phone_number);
      console.log('✅ Recipient created:', recipientResponse);
    }

    const paymentResponse = await createPaymentRequest(amount, recipientId || recipientResponse.id);

    console.log('✅ Payment request successful:', paymentResponse);

    return res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('❌ Payment request failed:', error.response?.data || error.message);

    return res.status(500).json({
      error: 'Payment creation failed.',
      details: error.response?.data || error.message,
    });
  }
};
