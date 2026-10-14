# BIDSPACE — Realistic Online Auction Platform

A modern, full-featured bidding website built for college showcase / project demonstration.

**Inspired by** professional platforms like LiveAuctioneers.

---

## Features

### Core Auction Experience
- **Homepage** with hero section, featured auctions, category grid, and “Ending Soon” countdown
- **Browse All Auctions** with category filters and sorting (ending soon, price, most bids)
- **Auction Detail Page** with image gallery, live countdown timer, bid history, quick-bid buttons
- **Real-time style timers** that count down every second
- **Place Bids** (simulated) — updates current price, bid count, and history instantly
- **Watchlist** — heart items and keep track of them (persisted in browser)

### User System
- Login / Register modals
- Session persisted with `localStorage`
- Personalized greeting when logged in
- Must be logged in to place bids or add to watchlist

### UI / UX
- Clean, professional design (Inter + Playfair Display fonts)
- Fully responsive (mobile, tablet, desktop)
- Smooth hover effects, toasts, modals
- Font Awesome icons
- High-quality Unsplash images for demo items

### Categories
Art · Jewelry · Furniture · Collectibles · Fashion · Home & Décor · Coins · Watches

---

## Project Structure

```
bidspace/
├── index.html              ← Homepage
├── css/
│   └── style.css           ← All styles
├── js/
│   ├── data.js             ← Sample auctions + categories
│   └── app.js              ← Application logic
├── pages/
│   ├── auctions.html       ← Browse / filter all lots
│   ├── detail.html         ← Single auction + bidding
│   └── how-to-bid.html     ← Help / instructions
└── README.md
```

---

## How to Run (for Teachers / Demo)

### Option 1 — Simple (Recommended)
1. Open the `bidspace` folder
2. Double-click `index.html`  
   **or** right-click → Open with → Chrome / Edge / Firefox

That’s it. Everything works offline (except the external images from Unsplash).

### Option 2 — Local Server (cleaner, no CORS issues)
```bash
# Using Python
cd bidspace
python -m http.server 8000

# Then open: http://localhost:8000
```

```bash
# Using VS Code
# Install “Live Server” extension → Right-click index.html → Open with Live Server
```

---

## How to Demonstrate

1. **Homepage** — Show the modern layout, featured items, categories.
2. **Register / Login** — Create an account (any email works for demo).
3. **Browse** — Go to “All Auctions”, filter by Jewelry or Art, sort by price.
4. **Watchlist** — Click the heart on a few items.
5. **Place a Bid** — Open any lot → enter an amount or use quick-bid buttons → see the price and history update live.
6. **Timer** — Point out the countdown that ticks every second.
7. **How to Bid page** — Show the clean documentation for users.

---

## Technologies Used

- HTML5
- CSS3 (Custom properties, Flexbox, Grid, animations)
- Vanilla JavaScript (ES6+)
- localStorage for persistence
- Font Awesome 6
- Google Fonts

No frameworks required — pure front-end so it is easy to understand and present.

---

## Sample Data

12 realistic auction lots with:
- Multiple images
- Starting & current bids
- Bid history
- Countdown timers
- Descriptions

You can easily add more items by editing `js/data.js`.

---

## Future Extensions (optional talking points)

- Backend (Node.js / Firebase) for real multi-user bidding
- Stripe / Razorpay payment integration
- Seller dashboard to create new auctions
- Email notifications when outbid
- Admin panel

---

**Built for college project showcase — 2026**  
**Name: BIDSPACE**
