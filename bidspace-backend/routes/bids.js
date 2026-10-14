const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
const MIN_INCREMENT = 500;

router.post('/bids', authRequired, (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    if (!auctionId || amount == null) {
      return res.status(400).json({ error: 'auctionId and amount required' });
    }
    const auction = db.findAuction(auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    if (new Date(auction.ends_at) <= new Date()) {
      return res.status(400).json({ error: 'Auction has ended' });
    }
    if (auction.seller_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot bid on your own auction' });
    }
    const bidAmount = parseInt(amount, 10);
    const minRequired = auction.current_bid + MIN_INCREMENT;
    if (isNaN(bidAmount) || bidAmount < minRequired) {
      return res.status(400).json({
        error: 'Bid must be at least ₹' + minRequired.toLocaleString('en-IN'),
        minRequired
      });
    }
    db.addBid(auctionId, req.user.id, bidAmount);
    db.updateAuctionBid(auctionId, bidAmount);
    const history = db.bidsForAuction(auctionId).map(h => {
      const u = db.findUserById(h.user_id);
      return { bidder: u ? u.name : 'Bidder', amount: h.amount, time: h.created_at };
    });
    res.status(201).json({
      message: 'Bid placed successfully',
      currentBid: bidAmount,
      bidCount: history.length,
      bidHistory: history
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

router.get('/bids/mine', authRequired, (req, res) => {
  try {
    const rows = db.bidsForUser(req.user.id);
    const map = new Map();
    rows.forEach(r => {
      if (!map.has(r.auction_id)) {
        const a = db.findAuction(r.auction_id);
        if (!a) return;
        map.set(r.auction_id, {
          auctionId: r.auction_id,
          title: a.title,
          image: a.image,
          yourBid: r.amount,
          currentBid: a.current_bid,
          endsAt: a.ends_at,
          bidAt: r.created_at
        });
      }
    });
    res.json({ bids: Array.from(map.values()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});

router.get('/watchlist', authRequired, (req, res) => {
  try {
    const items = db.getWatchlist(req.user.id).map(a => ({
      id: a.id,
      title: a.title,
      image: a.image,
      currentBid: a.current_bid,
      bids: db.bidsForAuction(a.id).length,
      seller: (db.findUserById(a.seller_id) || {}).name,
      endsAt: a.ends_at
    }));
    res.json({ count: items.length, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

router.post('/watchlist/:auctionId', authRequired, (req, res) => {
  try {
    if (!db.findAuction(req.params.auctionId)) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    db.addWatch(req.user.id, req.params.auctionId);
    res.json({ message: 'Added to watchlist', auctionId: Number(req.params.auctionId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

router.delete('/watchlist/:auctionId', authRequired, (req, res) => {
  try {
    db.removeWatch(req.user.id, req.params.auctionId);
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

router.post('/payments', authRequired, (req, res) => {
  try {
    const { auctionId, amount, method } = req.body;
    if (!auctionId || !amount) {
      return res.status(400).json({ error: 'auctionId and amount required' });
    }
    const auction = db.findAuction(auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    if (!db.maxBidForUser(auctionId, req.user.id)) {
      return res.status(400).json({ error: 'You have no bids on this auction' });
    }
    if (db.hasPaid(req.user.id, auctionId)) {
      return res.status(409).json({ error: 'Already paid for this auction' });
    }
    const code = 'PAY-' + Date.now();
    const payAmount = parseInt(amount, 10) || auction.current_bid;
    const payment = db.addPayment({
      payment_code: code,
      user_id: req.user.id,
      auction_id: auctionId,
      amount: payAmount,
      method: method || 'UPI / Card'
    });
    res.status(201).json({
      message: 'Payment successful',
      payment: {
        id: payment.payment_code,
        auctionId,
        title: auction.title,
        amount: payAmount,
        method: payment.method,
        status: 'Paid',
        date: payment.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment failed' });
  }
});

router.get('/payments/mine', authRequired, (req, res) => {
  try {
    const rows = db.paymentsForUser(req.user.id);
    res.json({
      totalPaid: rows.reduce((s, r) => s + r.amount, 0),
      payments: rows.map(r => {
        const a = db.findAuction(r.auction_id);
        return {
          id: r.payment_code,
          auctionId: r.auction_id,
          title: a ? a.title : 'Item',
          amount: r.amount,
          method: r.method,
          status: r.status,
          date: r.created_at
        };
      })
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.get('/dashboard/stats', authRequired, (req, res) => {
  try {
    res.json(db.stats(req.user.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
