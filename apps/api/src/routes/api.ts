import { Router } from 'express';
import { Invoice } from '../models/Invoice';
import { Treasury } from '../models/Treasury';
import { Subscription } from '../models/Subscription';
import { EventLog } from '../models/EventLog';
import { handleAiInvoice, handleAiSummary, handleAiPayment } from '../services/aiService';

const router = Router();

// =======================
// TREASURY ROUTES
// =======================
router.get('/treasury/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;
  let treasury = await Treasury.findOne({ walletAddress });
  if (!treasury) {
    treasury = await Treasury.create({ walletAddress });
  }
  res.json(treasury);
});

router.patch('/treasury/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;
  const updated = await Treasury.findOneAndUpdate(
    { walletAddress },
    { $set: req.body },
    { new: true, upsert: true }
  );
  res.json(updated);
});

// =======================
// INVOICE ROUTES
// =======================
router.post('/invoices', async (req, res) => {
  const invoice = await Invoice.create(req.body);
  res.json(invoice);
});

router.get('/invoices/:walletAddress', async (req, res) => {
  const invoices = await Invoice.find({ 
    $or: [{ senderWallet: req.params.walletAddress }, { recipientWallet: req.params.walletAddress }]
  }).sort({ createdAt: -1 });
  res.json(invoices);
});

router.patch('/invoices/:id', async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(invoice);
});

router.delete('/invoices/:id', async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// =======================
// SUBSCRIPTION ROUTES
// =======================
router.post('/subscriptions', async (req, res) => {
  const sub = await Subscription.create(req.body);
  res.json(sub);
});

router.get('/subscriptions/:walletAddress', async (req, res) => {
  const subs = await Subscription.find({ subscriberWallet: req.params.walletAddress }).sort({ createdAt: -1 });
  res.json(subs);
});

router.patch('/subscriptions/:id', async (req, res) => {
  const sub = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(sub);
});

router.delete('/subscriptions/:id', async (req, res) => {
  await Subscription.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// =======================
// EVENT LOG ROUTES
// =======================
router.post('/events', async (req, res) => {
  const event = await EventLog.create(req.body);
  res.json(event);
});

router.get('/events/:walletAddress', async (req, res) => {
  const events = await EventLog.find({ walletAddress: req.params.walletAddress }).sort({ createdAt: -1 });
  res.json(events);
});

// =======================
// AI ROUTES
// =======================
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

export default router;
