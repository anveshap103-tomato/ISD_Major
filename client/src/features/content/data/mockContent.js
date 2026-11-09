export const CONTENT_TYPES = [
  { label: 'All', value: 'ALL' },
  { label: 'Articles', value: 'ARTICLE' },
  { label: 'Videos', value: 'VIDEO' },
  { label: 'Books', value: 'BOOK' },
];

export const CATEGORIES = ['All', 'Technology', 'Design', 'Product', 'Career'];

export const MOCK_CONTENT = [
  { id: 'content-1', type: 'ARTICLE', title: 'A practical introduction to system design', description: 'Learn how to break a product into reliable, understandable systems.', category: 'Technology', author: 'Ryth Editorial', readTime: '8 min read', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', url: 'https://example.com/system-design' },
  { id: 'content-2', type: 'VIDEO', title: 'How designers turn research into better products', description: 'A focused discussion on using user research to make confident design decisions.', category: 'Design', author: 'Maya Kapoor', duration: '12 min', imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80', url: 'https://example.com/design-research' },
  { id: 'content-3', type: 'BOOK', title: 'The Design of Everyday Things', description: 'A classic guide to creating intuitive products that people enjoy using.', category: 'Design', author: 'Don Norman', isbn: '978-0465050659', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80', url: 'https://example.com/design-everyday-things' },
  { id: 'content-4', type: 'ARTICLE', title: 'Writing a product brief that aligns a team', description: 'A clear product brief helps teams make decisions before building begins.', category: 'Product', author: 'Ryth Editorial', readTime: '6 min read', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', url: 'https://example.com/product-brief' },
  { id: 'content-5', type: 'VIDEO', title: 'Build your first meaningful professional network', description: 'A practical approach to finding people, starting conversations and following up.', category: 'Career', author: 'Arjun Mehta', duration: '9 min', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80', url: 'https://example.com/network' },
  { id: 'content-6', type: 'BOOK', title: 'Inspired', description: 'A field guide to building technology products customers love.', category: 'Product', author: 'Marty Cagan', isbn: '978-1119387503', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80', url: 'https://example.com/inspired' },
];
