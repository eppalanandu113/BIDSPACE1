/* BIDSPACE — Main Application Logic */

// ========== STATE ==========
let currentUser = JSON.parse(localStorage.getItem('bidspace_user')) || null;
let watchlist = JSON.parse(localStorage.getItem('bidspace_watchlist')) || [];
let userBids = JSON.parse(localStorage.getItem('bidspace_bids')) || {};

// ========== UTILITIES ==========

function formatCurrency(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(n);
}


function formatTime(seconds) {
  if (seconds <= 0) return 'Ended';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function saveState() {
  localStorage.setItem('bidspace_user', JSON.stringify(currentUser));
  localStorage.setItem('bidspace_watchlist', JSON.stringify(watchlist));
  localStorage.setItem('bidspace_bids', JSON.stringify(userBids));
}

// ========== MODALS ==========
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

function switchModal(from, to) {
  closeModal(from);
  openModal(to);
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// ========== AUTH ==========

const API_BASE_URL = 'https://bidspace1.onrender.com/api';

async function handleLogin(e) {
  e.preventDefault();

  const form = e.target;
  const inputs = form.querySelectorAll('input');
  const email = inputs[0].value.trim();
  const password = inputs[1].value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('bidspace_token', data.token);
    currentUser = data.user;
    saveState();

    closeModal('loginModal');
    form.reset();
    updateNav();
    showToast(`Welcome back, ${currentUser.name}!`);
  } catch (error) {
    showToast(error.message || 'Could not connect to the server', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const form = e.target;
  const inputs = form.querySelectorAll('input');
  const name = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const password = inputs[2].value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('bidspace_token', data.token);
    currentUser = data.user;
    saveState();

    closeModal('registerModal');
    form.reset();
    updateNav();
    showToast(`Account created! Welcome, ${currentUser.name}!`);
  } catch (error) {
    showToast(error.message || 'Could not connect to the server', 'error');
  }
}


function logout() {
  currentUser = null;
  saveState();
  updateNav();
  showToast('Logged out successfully');
}

function updateNav() {
  const actions = document.querySelector('.nav-actions');
  if (!actions) return;

  if (currentUser) {
    actions.innerHTML = `
      <span style="font-weight:600;font-size:0.9rem;color:var(--text)">Hi, ${currentUser.name}</span>
      <button class="btn-outline" onclick="logout()">Log Out</button>
      <button class="btn-icon" id="watchlistBtn" title="Watchlist" onclick="showWatchlist()">
        <i class="fas fa-heart"></i>
        <span class="badge" id="watchCount">${watchlist.length}</span>
      </button>
    `;
  } else {
    // Ensure heart button always has click handler even when logged out
    const btn = document.getElementById('watchlistBtn');
    if (btn) {
      btn.onclick = showWatchlist;
      const badge = document.getElementById('watchCount');
      if (badge) badge.textContent = watchlist.length;
    }
  }
}

// ========== WATCHLIST ==========
function toggleWatch(id, e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  // Allow liking without login for better demo UX
  const idx = watchlist.indexOf(id);
  if (idx > -1) {
    watchlist.splice(idx, 1);
    showToast('Removed from watchlist');
  } else {
    watchlist.push(id);
    showToast('Added to watchlist ♥');
  }
  saveState();
  updateNav();
  // Update all heart buttons for this item
  document.querySelectorAll(`[data-watch="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', watchlist.includes(id));
  });
  // Also update detail page button if present
  const detailBtn = document.getElementById('detailWatch');
  if (detailBtn) {
    detailBtn.classList.toggle('active', watchlist.includes(id));
    detailBtn.innerHTML = watchlist.includes(id)
      ? '<i class="fas fa-heart"></i> In Watchlist'
      : '<i class="fas fa-heart"></i> Add to Watchlist';
  }
}

function showWatchlist() {
  // Create modal if it doesn't exist yet
  let modal = document.getElementById('watchlistModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'watchlistModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:520px">
        <button class="modal-close" onclick="closeModal('watchlistModal')">&times;</button>
        <h2><i class="fas fa-heart" style="color:#e74c3c"></i> Your Watchlist</h2>
        <p class="modal-sub">Items you are watching</p>
        <div id="watchlistItems" style="max-height:400px;overflow-y:auto"></div>
        <p class="modal-footer-text" id="watchlistEmpty" style="display:none">Your watchlist is empty. Click the ♥ on any item to add it.</p>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const container = document.getElementById('watchlistItems');
  const emptyMsg = document.getElementById('watchlistEmpty');
  const items = auctions.filter(a => watchlist.includes(a.id));

  if (!items.length) {
    container.innerHTML = '';
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    container.innerHTML = items.map(a => `
      <div style="display:flex;gap:1rem;align-items:center;padding:0.8rem 0;border-bottom:1px solid #e9ecef;cursor:pointer"
           onclick="closeModal('watchlistModal'); goToDetail(${a.id})">
        <img src="${a.image}" alt="" style="width:70px;height:70px;object-fit:cover;border-radius:8px;flex-shrink:0" />
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.title}</div>
          <div style="font-size:0.85rem;color:#636e72;margin-top:0.2rem">${formatCurrency(a.currentBid)} · ${a.bids} bids</div>
        </div>
        <button class="btn-icon" style="color:#e74c3c" onclick="event.stopPropagation(); toggleWatch(${a.id}); showWatchlist();" title="Remove">
          <i class="fas fa-heart"></i>
        </button>
      </div>
    `).join('');
  }

  openModal('watchlistModal');
}

// ========== RENDER HELPERS ==========
function createAuctionCard(a) {
  const isWatched = watchlist.includes(a.id);
  const badge = a.status === 'ending'
    ? `<span class="badge-ending">Ending Soon</span>`
    : `<span class="badge-live">Live</span>`;

  return `
    <div class="auction-card" onclick="goToDetail(${a.id})">
      <div class="img-wrap">
        <img src="${a.image}" alt="${a.title}" loading="lazy" />
        ${badge}
        <button class="watch-btn ${isWatched ? 'active' : ''}" data-watch="${a.id}"
                onclick="toggleWatch(${a.id}, event)">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="body">
        <div class="title">${a.title}</div>
        <div class="meta">${a.seller} · ${a.lot}</div>
        <div class="price-row">
          <div class="current-bid">
            Current Bid
            <strong>${formatCurrency(a.currentBid)}</strong>
          </div>
          <div class="bids-count">${a.bids} bids</div>
        </div>
      </div>
    </div>
  `;
}

function createEndingCard(a) {
  return `
    <div class="ending-card" onclick="goToDetail(${a.id})">
      <img src="${a.image}" alt="${a.title}" loading="lazy" />
      <div class="info">
        <div class="timer" data-ends="${a.endsIn}" data-id="${a.id}">
          <i class="fas fa-clock"></i> ${formatTime(a.endsIn)}
        </div>
        <h4>${a.title}</h4>
        <div class="bid">${formatCurrency(a.currentBid)}</div>
      </div>
    </div>
  `;
}

function createHeroCard(a) {
  return `
    <div class="hero-card" onclick="goToDetail(${a.id})">
      <img src="${a.image}" alt="${a.title}" loading="lazy" />
      <div class="info">
        <h4>${a.title}</h4>
        <span>${formatCurrency(a.currentBid)} · ${a.bids} bids</span>
      </div>
    </div>
  `;
}

// ========== PAGE RENDERERS ==========
function renderHome() {
  // Hero cards
  const heroEl = document.getElementById('heroCards');
  if (heroEl) {
    heroEl.innerHTML = auctions.filter(a => a.featured).slice(0, 4).map(createHeroCard).join('');
  }

  // Featured
  const featuredEl = document.getElementById('featuredAuctions');
  if (featuredEl) {
    featuredEl.innerHTML = auctions.filter(a => a.featured).map(createAuctionCard).join('');
  }

  // Categories
  const catEl = document.getElementById('categoryGrid');
  if (catEl) {
    catEl.innerHTML = categories.map(c => `
      <div class="cat-card" onclick="filterByCategory('${c.id}')">
        <i class="fas ${c.icon}"></i>
        <h4>${c.name}</h4>
        <span>${c.count} lots</span>
      </div>
    `).join('');
  }

  // Ending soon
  const endingEl = document.getElementById('endingSoon');
  if (endingEl) {
    const ending = [...auctions].sort((a, b) => a.endsIn - b.endsIn).slice(0, 6);
    endingEl.innerHTML = ending.map(createEndingCard).join('');
  }
}

function renderAuctionsPage() {
  const grid = document.getElementById('auctionsGrid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || 'all';
  const sort = params.get('sort') || 'ending';
  const search = (params.get('search') || '').toLowerCase();

  let list = [...auctions];
  if (cat !== 'all') list = list.filter(a => a.category === cat);
  if (search) {
    list = list.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.category.toLowerCase().includes(search) ||
      a.seller.toLowerCase().includes(search)
    );
  }

  if (sort === 'ending') list.sort((a, b) => a.endsIn - b.endsIn);
  else if (sort === 'price-low') list.sort((a, b) => a.currentBid - b.currentBid);
  else if (sort === 'price-high') list.sort((a, b) => b.currentBid - a.currentBid);
  else if (sort === 'bids') list.sort((a, b) => b.bids - a.bids);

  grid.innerHTML = list.length
    ? list.map(createAuctionCard).join('')
    : '<p style="grid-column:1/-1;text-align:center;padding:3rem;color:#636e72">No auctions found matching your criteria.</p>';

  // Update filter UI
  const catSelect = document.getElementById('catFilter');
  const sortSelect = document.getElementById('sortFilter');
  if (catSelect) catSelect.value = cat;
  if (sortSelect) sortSelect.value = sort;
}

function getBasePath() {
  // Returns '' when already inside /pages/, otherwise 'pages/'
  return window.location.pathname.includes('/pages/') ? '' : 'pages/';
}

function filterByCategory(cat) {
  window.location.href = `${getBasePath()}auctions.html?cat=${cat}`;
}

function applyFilters() {
  const cat = document.getElementById('catFilter')?.value || 'all';
  const sort = document.getElementById('sortFilter')?.value || 'ending';
  window.location.href = `${getBasePath()}auctions.html?cat=${cat}&sort=${sort}`;
}

// ========== DETAIL PAGE ==========
function goToDetail(id) {
  window.location.href = `${getBasePath()}detail.html?id=${id}`;
}

function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const auction = auctions.find(a => a.id === id);
  if (!auction) {
    document.body.innerHTML = '<div style="text-align:center;padding:4rem"><h1>Auction not found</h1><a href="../index.html">Back home</a></div>';
    return;
  }

  // Gallery
  const mainImg = document.getElementById('mainImg');
  const thumbs = document.getElementById('thumbs');
  if (mainImg) mainImg.src = auction.images[0] || auction.image;
  if (thumbs) {
    thumbs.innerHTML = (auction.images || [auction.image]).map((src, i) =>
      `<img src="${src}" class="${i === 0 ? 'active' : ''}" onclick="changeImage(this, '${src}')" />`
    ).join('');
  }

  // Info
  document.getElementById('lotNum').textContent = auction.lot;
  document.getElementById('itemTitle').textContent = auction.title;
  document.getElementById('sellerName').textContent = auction.seller;
  document.getElementById('currentAmount').textContent = formatCurrency(auction.currentBid);
  document.getElementById('bidCount').textContent = `${auction.bids} bids`;
  document.getElementById('timerDisplay').textContent = formatTime(auction.endsIn);
  document.getElementById('timerDisplay').dataset.ends = auction.endsIn;
  document.getElementById('timerDisplay').dataset.id = auction.id;
  document.getElementById('description').textContent = auction.description;

  // Bid input min
  const bidInput = document.getElementById('bidAmount');
  if (bidInput) {
    const minBid = auction.currentBid + 25;
    bidInput.min = minBid;
    bidInput.value = minBid;
    bidInput.placeholder = `Min ${formatCurrency(minBid)}`;
  }

  // Quick bids
  const quick = document.getElementById('quickBids');
  if (quick) {
    const increments = [25, 50, 100, 250];
    quick.innerHTML = increments.map(inc => {
      const val = auction.currentBid + inc;
      return `<button class="quick-bid" onclick="setBidAmount(${val})">${formatCurrency(val)}</button>`;
    }).join('');
  }

  // Bid history
  const historyEl = document.getElementById('bidHistory');
  if (historyEl) {
    historyEl.innerHTML = auction.bidHistory.map(b => `
      <div class="bid-item">
        <span class="bidder">${b.bidder}</span>
        <span>${formatCurrency(b.amount)}</span>
        <span class="time">${b.time}</span>
      </div>
    `).join('');
  }

  // Watch button
  const watchBtn = document.getElementById('detailWatch');
  if (watchBtn) {
    watchBtn.classList.toggle('active', watchlist.includes(auction.id));
    watchBtn.onclick = (e) => toggleWatch(auction.id, e);
  }
}

function changeImage(el, src) {
  document.getElementById('mainImg').src = src;
  document.querySelectorAll('.detail-thumbs img').forEach(img => img.classList.remove('active'));
  el.classList.add('active');
}

function setBidAmount(val) {
  const input = document.getElementById('bidAmount');
  if (input) input.value = val;
}

function placeBid() {
  if (!currentUser) {
    openModal('loginModal');
    showToast('Please log in to place a bid', 'error');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const auction = auctions.find(a => a.id === id);
  if (!auction) return;

  const input = document.getElementById('bidAmount');
  const amount = parseInt(input.value);

  if (isNaN(amount) || amount < auction.currentBid + 25) {
    showToast(`Bid must be at least ${formatCurrency(auction.currentBid + 25)}`, 'error');
    return;
  }

  // Update auction
  auction.currentBid = amount;
  auction.bids += 1;
  auction.bidHistory.unshift({
    bidder: currentUser.name,
    amount,
    time: 'Just now'
  });

  // Track user bid
  if (!userBids[id]) userBids[id] = [];
  userBids[id].push({ amount, time: new Date().toISOString() });
  saveState();

  // Re-render
  document.getElementById('currentAmount').textContent = formatCurrency(amount);
  document.getElementById('bidCount').textContent = `${auction.bids} bids`;
  document.getElementById('bidHistory').innerHTML = auction.bidHistory.map(b => `
    <div class="bid-item">
      <span class="bidder">${b.bidder}</span>
      <span>${formatCurrency(b.amount)}</span>
      <span class="time">${b.time}</span>
    </div>
  `).join('');

  const minBid = amount + 25;
  input.min = minBid;
  input.value = minBid;

  // Update quick bids
  const quick = document.getElementById('quickBids');
  if (quick) {
    const increments = [25, 50, 100, 250];
    quick.innerHTML = increments.map(inc => {
      const val = amount + inc;
      return `<button class="quick-bid" onclick="setBidAmount(${val})">${formatCurrency(val)}</button>`;
    }).join('');
  }

  showToast(`Bid of ${formatCurrency(amount)} placed successfully!`);
}

// ========== LIVE TIMERS ==========
function startTimers() {
  setInterval(() => {
    document.querySelectorAll('[data-ends]').forEach(el => {
      let ends = parseInt(el.dataset.ends);
      if (ends > 0) {
        ends -= 1;
        el.dataset.ends = ends;
        const id = parseInt(el.dataset.id);
        const auction = auctions.find(a => a.id === id);
        if (auction) auction.endsIn = ends;
        el.innerHTML = ends <= 0
          ? '<i class="fas fa-flag-checkered"></i> Ended'
          : `<i class="fas fa-clock"></i> ${formatTime(ends)}`;
      }
    });
  }, 1000);
}

// ========== SEARCH ==========
function setupSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      const results = auctions.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.seller.toLowerCase().includes(q)
      );
      if (results.length === 0) {
        showToast('No items found', 'error');
      } else {
        // Simple redirect to auctions with filter feel
        sessionStorage.setItem('searchResults', JSON.stringify(results.map(r => r.id)));
        window.location.href = getBasePath() + 'auctions.html?search=' + encodeURIComponent(q);
      }
    }
  });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  setupSearch();
  startTimers();

  const path = window.location.pathname;

  if (path.includes('detail.html')) {
    renderDetail();
  } else if (path.includes('auctions.html')) {
    renderAuctionsPage();
  } else {
    renderHome();
  }
});
