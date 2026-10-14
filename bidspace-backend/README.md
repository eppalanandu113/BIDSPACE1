# BIDSPACE Backend API

Node.js + Express + JSON file database for the BIDSPACE auction platform.

**Currency:** Indian Rupees (₹ INR)

---

## Why this backend?

A real auction website needs a backend for:
- Secure login & passwords
- Saving auctions/bids for all users (not only in one browser)
- Preventing fake bids
- Payment records
- Seller listings

This API provides all of that. Database is a simple file (`data/store.json`) — no MongoDB/MySQL install.

---

## Setup

### 1. Install Node.js
https://nodejs.org (LTS)

### 2. Install & seed
```bash
cd bidspace-backend
npm install
npm run seed
npm start
```

API: **http://localhost:5000**  
Docs: http://localhost:5000/api  

### Demo logins (after seed)
| Email | Password |
|-------|----------|
| alex@college.edu | password123 |
| jordan@college.edu | password123 |
| seller@bidspace.college | password123 |

---

## API Endpoints

### Auth
```
POST /api/auth/register   { name, email, password }
POST /api/auth/login      { email, password }
POST /api/auth/google     { name, email, avatar? }
GET  /api/auth/me         Authorization: Bearer <token>
PUT  /api/auth/me         { name?, bio?, phone? }
```

### Auctions
```
GET  /api/auctions?category=art&sort=ending&search=paint
GET  /api/auctions/:id
POST /api/auctions        { title, category, startingBid, durationHours, description, image }
GET  /api/auctions/user/mine
```

### Bids (amounts in ₹)
```
POST /api/bids            { auctionId, amount }
GET  /api/bids/mine
```

### Watchlist
```
GET    /api/watchlist
POST   /api/watchlist/:auctionId
DELETE /api/watchlist/:auctionId
```

### Payments
```
POST /api/payments        { auctionId, amount, method? }
GET  /api/payments/mine
```

### Dashboard
```
GET /api/dashboard/stats
```

Minimum bid increase: **₹500**

---

## Project structure

```
bidspace-backend/
├── server.js
├── db.js              ← JSON database
├── seed.js
├── package.json
├── middleware/auth.js ← JWT
├── routes/
│   ├── auth.js
│   ├── auctions.js
│   └── bids.js
└── data/store.json    ← auto-created
```

---

## Example curl

```bash
# Login
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@college.edu","password":"password123"}'

# Place bid (paste token)
curl -s -X POST http://localhost:5000/api/bids \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"auctionId":1,"amount":101000}'
```

---

## Frontend connection

Include `bidspace/js/api.js` and set `USE_BACKEND = true`.  
API base: `http://localhost:5000/api`

---

## Viva talking points

1. Passwords hashed with bcrypt  
2. JWT for session (7 days)  
3. Seller cannot bid on own item  
4. Bid must be ≥ current + ₹500  
5. Google login is demo — production uses Google Identity / Firebase  
6. Payments can connect to Razorpay  
7. Scale later: PostgreSQL + WebSockets for live bids  

**BIDSPACE College Project 2026**
