/**
 * BIDSPACE Database — JSON file store (no native modules)
 * File: data/store.json
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const storePath = path.join(dataDir, 'store.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const defaultStore = {
  users: [],
  auctions: [],
  bids: [],
  watchlist: [],
  payments: [],
  nextIds: { users: 1, auctions: 1, bids: 1, payments: 1 }
};

function load() {
  try {
    if (fs.existsSync(storePath)) {
      return JSON.parse(fs.readFileSync(storePath, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read store, using empty DB');
  }
  return JSON.parse(JSON.stringify(defaultStore));
}

function save(store) {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

let store = load();

const db = {
  getStore: () => store,
  save: () => save(store),

  findUserByEmail(email) {
    return store.users.find(u => u.email === String(email).toLowerCase()) || null;
  },
  findUserById(id) {
    return store.users.find(u => u.id === Number(id)) || null;
  },
  createUser(data) {
    const user = {
      id: store.nextIds.users++,
      name: data.name,
      email: String(data.email).toLowerCase(),
      password: data.password || null,
      login_method: data.login_method || 'email',
      avatar: data.avatar || null,
      bio: data.bio || '',
      phone: data.phone || '',
      created_at: new Date().toISOString()
    };
    store.users.push(user);
    save(store);
    return user;
  },
  updateUser(id, fields) {
    const u = store.users.find(x => x.id === Number(id));
    if (!u) return null;
    if (fields.name != null) u.name = fields.name;
    if (fields.bio != null) u.bio = fields.bio;
    if (fields.phone != null) u.phone = fields.phone;
    if (fields.avatar != null) u.avatar = fields.avatar;
    save(store);
    return u;
  },
  safeUser(u) {
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      login_method: u.login_method,
      avatar: u.avatar,
      bio: u.bio,
      phone: u.phone,
      created_at: u.created_at
    };
  },

  listAuctions({ category, sort, search, featured, sellerId } = {}) {
    let list = store.auctions.slice();
    if (sellerId) list = list.filter(a => a.seller_id === Number(sellerId));
    if (category && category !== 'all') list = list.filter(a => a.category === category);
    if (featured) list = list.filter(a => a.featured);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => {
        const seller = store.users.find(u => u.id === a.seller_id);
        return (
          a.title.toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q) ||
          (seller && seller.name.toLowerCase().includes(q))
        );
      });
    }
    list.forEach(a => {
      a._bid_count = store.bids.filter(b => b.auction_id === a.id).length;
    });
    if (sort === 'price-low') list.sort((a, b) => a.current_bid - b.current_bid);
    else if (sort === 'price-high') list.sort((a, b) => b.current_bid - a.current_bid);
    else if (sort === 'bids') list.sort((a, b) => b._bid_count - a._bid_count);
    else list.sort((a, b) => new Date(a.ends_at) - new Date(b.ends_at));
    return list;
  },
  findAuction(id) {
    return store.auctions.find(a => a.id === Number(id)) || null;
  },
  createAuction(data) {
    const auction = {
      id: store.nextIds.auctions++,
      title: data.title,
      category: data.category,
      description: data.description || '',
      image: data.image,
      starting_bid: data.starting_bid,
      current_bid: data.current_bid,
      condition: data.condition || 'Good',
      seller_id: data.seller_id,
      lot: data.lot,
      ends_at: data.ends_at,
      status: 'live',
      featured: data.featured ? 1 : 0,
      created_at: new Date().toISOString()
    };
    store.auctions.unshift(auction);
    save(store);
    return auction;
  },
  updateAuctionBid(id, amount) {
    const a = store.auctions.find(x => x.id === Number(id));
    if (a) {
      a.current_bid = amount;
      save(store);
    }
    return a;
  },

  addBid(auctionId, userId, amount) {
    const bid = {
      id: store.nextIds.bids++,
      auction_id: Number(auctionId),
      user_id: Number(userId),
      amount: Number(amount),
      created_at: new Date().toISOString()
    };
    store.bids.push(bid);
    save(store);
    return bid;
  },
  bidsForAuction(auctionId) {
    return store.bids
      .filter(b => b.auction_id === Number(auctionId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  bidsForUser(userId) {
    return store.bids
      .filter(b => b.user_id === Number(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  maxBidForUser(auctionId, userId) {
    const bids = store.bids.filter(
      b => b.auction_id === Number(auctionId) && b.user_id === Number(userId)
    );
    if (!bids.length) return null;
    return Math.max(...bids.map(b => b.amount));
  },

  getWatchlist(userId) {
    const ids = store.watchlist
      .filter(w => w.user_id === Number(userId))
      .map(w => w.auction_id);
    return store.auctions.filter(a => ids.includes(a.id));
  },
  addWatch(userId, auctionId) {
    const exists = store.watchlist.find(
      w => w.user_id === Number(userId) && w.auction_id === Number(auctionId)
    );
    if (!exists) {
      store.watchlist.push({
        user_id: Number(userId),
        auction_id: Number(auctionId),
        created_at: new Date().toISOString()
      });
      save(store);
    }
  },
  removeWatch(userId, auctionId) {
    store.watchlist = store.watchlist.filter(
      w => !(w.user_id === Number(userId) && w.auction_id === Number(auctionId))
    );
    save(store);
  },

  addPayment(data) {
    const payment = {
      id: store.nextIds.payments++,
      payment_code: data.payment_code,
      user_id: Number(data.user_id),
      auction_id: Number(data.auction_id),
      amount: Number(data.amount),
      method: data.method || 'UPI / Card',
      status: 'Paid',
      created_at: new Date().toISOString()
    };
    store.payments.unshift(payment);
    save(store);
    return payment;
  },
  paymentsForUser(userId) {
    return store.payments.filter(p => p.user_id === Number(userId));
  },
  hasPaid(userId, auctionId) {
    return store.payments.some(
      p => p.user_id === Number(userId) && p.auction_id === Number(auctionId)
    );
  },

  stats(userId) {
    const uid = Number(userId);
    return {
      listings: store.auctions.filter(a => a.seller_id === uid).length,
      bids: new Set(store.bids.filter(b => b.user_id === uid).map(b => b.auction_id)).size,
      watchlist: store.watchlist.filter(w => w.user_id === uid).length,
      totalPaid: store.payments
        .filter(p => p.user_id === uid)
        .reduce((s, p) => s + p.amount, 0)
    };
  },

  clearAll() {
    store = JSON.parse(JSON.stringify(defaultStore));
    save(store);
  }
};

module.exports = db;
