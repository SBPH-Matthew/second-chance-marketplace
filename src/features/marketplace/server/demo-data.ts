export const demoFeed = [
  {
    id: 'demo-1',
    title: 'Heritage Leather Weekender',
    priceCents: 145000,
    location: 'Makati City',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likesCount: 14,
    viewsCount: 210,
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa' }],
    seller: { profile: { username: 'mika_sells' } },
  },
  {
    id: 'demo-2',
    title: 'Vintage Brass Desk Lamp',
    priceCents: 39000,
    location: 'Taguig',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    likesCount: 8,
    viewsCount: 97,
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c' }],
    seller: { profile: { username: 'mika_sells' } },
  },
]
