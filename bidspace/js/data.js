/* BIDSPACE — Sample Auction Data */

const categories = [
  { id: 'art', name: 'Art', icon: 'fa-palette', count: 128 },
  { id: 'jewelry', name: 'Jewelry', icon: 'fa-gem', count: 94 },
  { id: 'furniture', name: 'Furniture', icon: 'fa-couch', count: 67 },
  { id: 'collectibles', name: 'Collectibles', icon: 'fa-box-open', count: 156 },
  { id: 'fashion', name: 'Fashion', icon: 'fa-shirt', count: 82 },
  { id: 'decor', name: 'Home & Décor', icon: 'fa-lamp', count: 73 },
  { id: 'coins', name: 'Coins', icon: 'fa-coins', count: 41 },
  { id: 'watches', name: 'Watches', icon: 'fa-clock', count: 55 }
];

const auctions = [
  {
    id: 1,
    title: "Mid-Century Modern Walnut Desk",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"
    ],
    currentBid: 1250,
    startingBid: 500,
    bids: 18,
    endsIn: 2 * 3600 + 34 * 60, // seconds
    seller: "Campus Vintage Co.",
    lot: "LOT-1042",
    description: "Stunning mid-century modern walnut writing desk with tapered legs and original brass hardware. Fully restored, excellent condition. Perfect for a modern student apartment or office. Dimensions: 54\" W × 28\" D × 30\" H.",
    status: "live",
    featured: true
  },
  {
    id: 2,
    title: "Vintage Chanel Quilted Handbag — Classic Flap",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76acc0?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76acc0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=600&fit=crop"
    ],
    currentBid: 3200,
    startingBid: 1500,
    bids: 27,
    endsIn: 5 * 3600 + 12 * 60,
    seller: "Luxury Resale Hub",
    lot: "LOT-2087",
    description: "Authentic vintage Chanel classic flap bag in soft yellow lambskin with gold-tone hardware. Double chain strap, signature diamond quilting. Includes authenticity card and dust bag. Light wear consistent with age.",
    status: "live",
    featured: true
  },
  {
    id: 3,
    title: "Tiffany Studios Style Table Lamp",
    category: "decor",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop"
    ],
    currentBid: 875,
    startingBid: 300,
    bids: 14,
    endsIn: 1 * 3600 + 8 * 60,
    seller: "Artisan Lighting",
    lot: "LOT-3310",
    description: "Beautiful stained-glass table lamp in the Tiffany Studios style. Hand-cut glass panels in warm amber and amber tones. Bronze base with original patina. Fully rewired for safety. A true statement piece.",
    status: "ending",
    featured: true
  },
  {
    id: 4,
    title: "Art Deco Turquoise & Gold Brooch",
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop"
    ],
    currentBid: 640,
    startingBid: 200,
    bids: 9,
    endsIn: 8 * 3600,
    seller: "Heritage Jewels",
    lot: "LOT-4451",
    description: "Exquisite Art Deco style brooch featuring natural turquoise cabochons set in 18k yellow gold with diamond accents. Intricate openwork design. Comes with appraisal certificate.",
    status: "live",
    featured: true
  },
  {
    id: 5,
    title: "Rare 19th Century Botanical Print Set",
    category: "art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop"
    ],
    currentBid: 420,
    startingBid: 100,
    bids: 11,
    endsIn: 45 * 60,
    seller: "Rare Books & Prints",
    lot: "LOT-5120",
    description: "Complete set of six hand-colored botanical engravings from the early 1800s. Depicting exotic mushrooms and fungi. Excellent condition with original plate marks. Professionally matted and ready to frame.",
    status: "ending",
    featured: false
  },
  {
    id: 6,
    title: "Garnet Multi-Strand Cuff Bracelet",
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop"
    ],
    currentBid: 380,
    startingBid: 150,
    bids: 7,
    endsIn: 3 * 3600 + 20 * 60,
    seller: "Autumn Adornments",
    lot: "LOT-6203",
    description: "Striking multi-strand cuff bracelet featuring natural garnet beads. Flexible design fits most wrists. Secure clasp. Perfect statement piece for evening wear.",
    status: "live",
    featured: false
  },
  {
    id: 7,
    title: "Antique Silver Chatelaine",
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop"
    ],
    currentBid: 295,
    startingBid: 80,
    bids: 5,
    endsIn: 6 * 3600,
    seller: "Autumn Adornments",
    lot: "LOT-6208",
    description: "Victorian-era silver chatelaine with multiple dangling charms and tools. Intricate engraving throughout. A rare functional jewelry piece from the late 1800s.",
    status: "live",
    featured: false
  },
  {
    id: 8,
    title: "Gold Mesh Statement Necklace",
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=600&fit=crop"
    ],
    currentBid: 1100,
    startingBid: 400,
    bids: 16,
    endsIn: 12 * 3600,
    seller: "Fine Gold Co.",
    lot: "LOT-7315",
    description: "Bold 18k gold mesh collar necklace with textured circular links. Adjustable length. Weighs approximately 42 grams. Comes with original box and certificate of authenticity.",
    status: "live",
    featured: false
  },
  {
    id: 9,
    title: "Celestial Star Map — Hand-Colored Engraving",
    category: "art",
    image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=600&fit=crop"
    ],
    currentBid: 560,
    startingBid: 200,
    bids: 13,
    endsIn: 4 * 3600 + 50 * 60,
    seller: "Rare Books & Prints",
    lot: "LOT-5144",
    description: "Magnificent 18th-century celestial star map with hand-applied watercolor. Shows constellations of the northern hemisphere. Framed in period-appropriate gilt wood frame.",
    status: "live",
    featured: false
  },
  {
    id: 10,
    title: "Leather-Bound Bird Illustration Volume",
    category: "collectibles",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop"
    ],
    currentBid: 780,
    startingBid: 250,
    bids: 10,
    endsIn: 9 * 3600,
    seller: "Rare Books & Prints",
    lot: "LOT-5189",
    description: "Complete leather-bound volume of exotic bird illustrations from a 19th-century natural history series. 48 full-page hand-colored plates. Tight binding, minor foxing on endpapers.",
    status: "live",
    featured: false
  },
  {
    id: 11,
    title: "Modern Abstract Oil Painting — 'Horizon'",
    category: "art",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop"
    ],
    currentBid: 950,
    startingBid: 400,
    bids: 8,
    endsIn: 15 * 3600,
    seller: "Student Art Collective",
    lot: "LOT-9001",
    description: "Original oil on canvas by emerging campus artist. Large-scale abstract landscape in rich earth tones. Signed and dated. Certificate of authenticity included. 36\" × 48\".",
    status: "live",
    featured: false
  },
  {
    id: 12,
    title: "Vintage Rolex Submariner (Ref. 5513)",
    category: "watches",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop"
    ],
    currentBid: 8500,
    startingBid: 5000,
    bids: 22,
    endsIn: 20 * 3600,
    seller: "Timepiece Gallery",
    lot: "LOT-1102",
    description: "Classic Rolex Submariner Reference 5513, circa 1970s. Automatic movement, black dial, Mercedes hands. Recently serviced. Includes original bracelet and papers. Excellent overall condition.",
    status: "live",
    featured: true
  }
];

/* Generate realistic bid history for each auction */
function generateBidHistory(auction) {
  const history = [];
  let price = auction.startingBid;
  const increments = [25, 50, 75, 100, 150, 200];
  const names = ["Alex R.", "Jordan K.", "Sam T.", "Casey M.", "Riley P.", "Morgan L.", "Quinn S.", "Avery B.", "Taylor W.", "Jamie H."];
  
  for (let i = 0; i < auction.bids; i++) {
    price += increments[Math.floor(Math.random() * increments.length)];
    const minsAgo = Math.floor(Math.random() * 120) + (auction.bids - i) * 3;
    history.unshift({
      bidder: names[Math.floor(Math.random() * names.length)],
      amount: price,
      time: minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`
    });
  }
  // Ensure last bid matches current
  if (history.length) history[0].amount = auction.currentBid;
  return history;
}

auctions.forEach(a => {
  a.bidHistory = generateBidHistory(a);
});
