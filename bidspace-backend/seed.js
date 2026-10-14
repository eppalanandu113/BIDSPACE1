const bcrypt = require('bcryptjs');
const db = require('./db');

console.log('Seeding BIDSPACE database...');
db.clearAll();

const hash = bcrypt.hashSync('password123', 10);

const seller = db.createUser({
  name: 'Campus Vintage Co.',
  email: 'seller@bidspace.college',
  password: hash,
  bio: 'Trusted campus seller of antiques & art.'
});
const alex = db.createUser({
  name: 'Alex Rivera',
  email: 'alex@college.edu',
  password: hash,
  bio: 'Student collector. Love paintings and jewelry.'
});
db.createUser({
  name: 'Jordan Lee',
  email: 'jordan@college.edu',
  password: hash,
  bio: 'Bid regularly on furniture and decor.'
});

const hoursFromNow = (h) => new Date(Date.now() + h * 3600 * 1000).toISOString();

const samples = [
  {
    title: 'Mid-Century Modern Walnut Desk',
    category: 'furniture',
    description: 'Stunning mid-century modern walnut writing desk. Fully restored.',
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=400&fit=crop',
    start: 40000, current: 100000, lot: 'LOT-1042', ends: 26, featured: 1
  },
  {
    title: 'Vintage Chanel-Style Quilted Handbag',
    category: 'fashion',
    description: 'Classic flap bag in soft yellow with gold-tone hardware.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76acc0?w=600&h=400&fit=crop',
    start: 120000, current: 256000, lot: 'LOT-2087', ends: 48, featured: 1
  },
  {
    title: 'Tiffany Studios Style Table Lamp',
    category: 'decor',
    description: 'Beautiful stained-glass table lamp with amber tones.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop',
    start: 24000, current: 70000, lot: 'LOT-3310', ends: 8, featured: 1
  },
  {
    title: 'Art Deco Turquoise & Gold Brooch',
    category: 'jewelry',
    description: 'Art Deco brooch with natural turquoise in 18k gold.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop',
    start: 16000, current: 51200, lot: 'LOT-4451', ends: 36, featured: 1
  },
  {
    title: 'Original Oil Painting — Campus Sunset',
    category: 'art',
    description: 'Student artist original. Oil on canvas, 24x36 inches.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop',
    start: 5000, current: 18500, lot: 'LOT-9001', ends: 20, featured: 0
  },
  {
    title: 'Rare 19th Century Botanical Print Set',
    category: 'art',
    description: 'Six hand-colored botanical engravings. Excellent condition.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    start: 8000, current: 33600, lot: 'LOT-5120', ends: 12, featured: 0
  }
];

samples.forEach(s => {
  const a = db.createAuction({
    title: s.title,
    category: s.category,
    description: s.description,
    image: s.image,
    starting_bid: s.start,
    current_bid: s.current,
    condition: 'Good',
    seller_id: seller.id,
    lot: s.lot,
    ends_at: hoursFromNow(s.ends),
    featured: s.featured
  });
  if (s.current > s.start) {
    db.addBid(a.id, alex.id, s.current - 2000);
    db.addBid(a.id, alex.id, s.current);
  }
});

console.log('✓ Users:');
console.log('  seller@bidspace.college / password123');
console.log('  alex@college.edu / password123');
console.log('  jordan@college.edu / password123');
console.log('✓ ' + samples.length + ' auctions (₹ INR)');
console.log('Done. Start with: npm start');
