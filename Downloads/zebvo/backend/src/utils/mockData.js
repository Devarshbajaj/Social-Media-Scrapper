/**
 * Mock Data Service - Provides demo posts for testing without APIs
 */

export const generateMockPosts = (count = 20) => {
  const categories = ['Application', 'Renewal', 'Appointments', 'Tatkal', 'Visa', 'Travel Issues', 'Government Announcements', 'News', 'Personal Experiences', 'Other'];
  const sentiments = ['positive', 'neutral', 'negative'];
  const platforms = ['twitter', 'reddit', 'youtube'];
  
  const mockTexts = [
    'Just got my passport renewed! The process was smooth and quick at the local office.',
    'Passport interview scheduled for next week. Nervous but excited to travel!',
    'Why is passport processing taking so long? Applied 2 months ago...',
    'New passport design looks amazing! Love the security features.',
    'Emergency passport approved in 24 hours! Thank you support team.',
    'Lost my passport while traveling. Replaced it at the embassy in 3 days.',
    'Passport expired last month. Renewal appointment booked for next month.',
    'Just renewed online. Much easier than I expected!',
    'Waiting for passport for 6 weeks now. Getting frustrated.',
    'Passport interview went great! Approved immediately.',
    'New passport arrived today! Ready for my vacation.',
    'Passport renewal costs way too much these days.',
    'Used emergency passport service. Highly recommended!',
    'My passport application was rejected. Need to reapply with correct documents.',
    'Passport validity checking online now. Much more convenient.',
  ];

  const posts = [];
  
  for (let i = 0; i < count; i++) {
    posts.push({
      postId: `mock-${i}-${Date.now()}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      author: {
        handle: `user${Math.floor(Math.random() * 10000)}`,
        name: `User ${i + 1}`,
        profileUrl: `https://example.com/user${i}`,
        followers: Math.floor(Math.random() * 100000),
        avatar: `https://i.pravatar.cc/150?img=${i}`,
      },
      content: mockTexts[Math.floor(Math.random() * mockTexts.length)],
      originalContent: mockTexts[Math.floor(Math.random() * mockTexts.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      sentimentScore: Math.random(),
      gibberishScore: Math.random() * 0.3,
      isGibberish: false,
      engagement: {
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
        views: Math.floor(Math.random() * 50000),
      },
      postUrl: `https://example.com/post/${i}`,
      language: 'en',
      region: 'US',
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      translations: {
        hi: 'अनुवादित सामग्री',
        es: 'Contenido traducido',
        fr: 'Contenu traduit',
      },
    });
  }
  
  return posts;
};
