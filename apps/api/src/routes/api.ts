import { Router } from 'express';
import { Invoice } from '../models/Invoice';
import { Treasury } from '../models/Treasury';
import { Subscription } from '../models/Subscription';
import { EventLog } from '../models/EventLog';
import { handleAiInvoice, handleAiSummary, handleAiPayment } from '../services/aiService';

const router = Router();

// Treasuries
router.get('/treasury/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;
  let treasury = await Treasury.findOne({ walletAddress });
  if (!treasury) {
    treasury = await Treasury.create({ walletAddress });
  }
  res.json(treasury);
});

// Invoices
router.post('/invoices', async (req, res) => {
  const invoice = await Invoice.create(req.body);
  res.json(invoice);
});

router.get('/invoices/:walletAddress', async (req, res) => {
  const invoices = await Invoice.find({ 
    $or: [{ senderWallet: req.params.walletAddress }, { recipientWallet: req.params.walletAddress }]
  });
  res.json(invoices);
});

// AI Routes
router.post('/ai/invoice', async (req, res) => {
  try {
    const result = await handleAiInvoice(req.body.prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'AI failed' });
  }
});

router.post('/ai/summary', async (req, res) => {
  try {
    const result = await handleAiSummary(req.body.treasury);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'AI failed' });
  }
});

router.post('/ai/payment', async (req, res) => {
  try {
    const result = await handleAiPayment(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'AI failed' });
  }
});

// Event Logs
router.get('/events/:walletAddress', async (req, res) => {
  const events = await EventLog.find({ walletAddress: req.params.walletAddress }).sort({ createdAt: -1 });
  res.json(events);
});

export default router;
