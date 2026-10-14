/**
 * BIDSPACE Backend Server
 * Node.js + Express + SQLite
 *
 * Run: npm install && npm start
 * API base: http://localhost:5000/api
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

// Init DB (creates tables)
require('./db');

const authRoutes = require('./routes/auth');
const auctionRoutes = require('./routes/auctions');
const bidRoutes = require('./routes/bids');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Request log (helpful for demo)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);

// Bids, watchlist, payments, dashboard (from bids.js router)
// Bids, watchlist, payments, dashboard
app.use('/api', bidRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'BIDSPACE API',
    version: '1.0.0',
    currency: 'INR',
    time: new Date().toISOString()
  });
});

// API documentation (simple)
app.get('/api', (req, res) => {
  res.json({
    message: 'BIDSPACE Auction API',
    currency: 'INR (₹)',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register with email',
        'POST /api/auth/login': 'Login with email',
        'POST /api/auth/google': 'Google login (demo)',
        'GET /api/auth/me': 'Current user (Bearer token)',
        'PUT /api/auth/me': 'Update profile'
      },
      auctions: {
        'GET /api/auctions': 'List auctions (?category=&sort=&search=)',
        'GET /api/auctions/:id': 'Auction detail + bid history',
        'POST /api/auctions': 'Create auction (auth)',
        'GET /api/auctions/user/mine': 'My listings (auth)'
      },
      bids: {
        'POST /api/bids': 'Place bid { auctionId, amount } (auth)',
        'GET /api/bids/mine': 'My bids (auth)'
      },
      watchlist: {
        'GET /api/watchlist': 'My watchlist (auth)',
        'POST /api/watchlist/:auctionId': 'Add (auth)',
        'DELETE /api/watchlist/:auctionId': 'Remove (auth)'
      },
      payments: {
        'POST /api/payments': 'Pay for won item (auth)',
        'GET /api/payments/mine': 'Payment history (auth)'
      },
      dashboard: {
        'GET /api/dashboard/stats': 'Dashboard counts (auth)'
      }
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  BIDSPACE API running');
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → http://localhost:${PORT}/api`);
  console.log(`  → Health: http://localhost:${PORT}/api/health`);
  console.log('  Currency: INR (₹)');
  console.log('═══════════════════════════════════════════');
  console.log('');
});
