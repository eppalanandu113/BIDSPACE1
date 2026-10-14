const express = require('express');
const db = require('../db');
const { authRequired, authOptional } = require('../middleware/auth');

const router = express.Router();

function endsInSeconds(endsAt) {
  return Math.max(0, Math.floor((new Date(endsAt) - new Date()) / 1000));
}

function formatAuction(row) {
  const seller = db.findUserById(row.seller_id);
  const bidCount = row._bid_count != null
    ? row._bid_count
    : db.bidsForAuction(row.id).length;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    image: row.image,
    images: row.image ? [row.image] : [],
    startingBid: row.starting_bid,
    currentBid: row.current_bid,
    condition: row.condition,
    seller: seller ? seller.name : 'Seller',
    sellerId: row.seller_id,
    sellerEmail: seller ? seller.email : null,
    lot: row.lot,
    endsIn: endsInSeconds(row.ends_at),
    endsAt: row.ends_at,
    status: endsInSeconds(row.ends_at) <= 0 ? 'ended' : row.status,
    featured: !!row.featured,
    bids: bidCount,
    createdAt: row.created_at
  };
}

router.get('/user/mine', authRequired, (req, res) => {
  try {
    const rows = db.listAuctions({ sellerId: req.user.id, sort: 'ending' });
    res.json({ count: rows.length, auctions: rows.map(formatAuction) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
});

router.get('/', authOptional, (req, res) => {
  try {
    const { category, sort, search, featured } = req.query;
    const rows = db.listAuctions({
      category,
      sort,
      search,
      featured: featured === '1' || featured === 'true'
    });
    res.json({ count: rows.length, auctions: rows.map(formatAuction) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

router.get('/:id', authOptional, (req, res) => {
  try {
    const row = db.findAuction(req.params.id);
    if (!row) return res.status(404).json({ error: 'Auction not found' });
    const history = db.bidsForAuction(row.id).map(h => {
      const u = db.findUserById(h.user_id);
      return { bidder: u ? u.name : 'Bidder', amount: h.amount, time: h.created_at };
    });
    const auction = formatAuction(row);
    auction.bidHistory = history;
    res.json({ auction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
});

router.post('/', authRequired, (req, res) => {
  try {
    const { title, category, description, image, startingBid, durationHours, condition } = req.body;
    if (!title || !category || !startingBid) {
      return res.status(400).json({ error: 'Title, category and starting bid are required' });
    }
    const start = parseInt(startingBid, 10);
    if (isNaN(start) || start < 1) {
      return res.status(400).json({ error: 'Starting bid must be a positive number (INR)' });
    }
    const hours = parseInt(durationHours, 10) || 72;
    const endsAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();
    const lot = 'LOT-U' + String(Date.now()).slice(-6);
    const row = db.createAuction({
      title: title.trim(),
      category,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop',
      starting_bid: start,
      current_bid: start,
      condition: condition || 'Good',
      seller_id: req.user.id,
      lot,
      ends_at: endsAt
    });
    res.status(201).json({ message: 'Auction created successfully', auction: formatAuction(row) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

module.exports = router;
