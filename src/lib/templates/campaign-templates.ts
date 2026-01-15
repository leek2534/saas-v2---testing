// Campaign Templates for Multi-Platform Campaign Builder
// Pre-built templates that users can start with

import { FlowData, FlowNode, FlowEdge } from '../types/campaign-builder';

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  platforms: string[];
  flow: FlowData;
  estimatedDuration: number; // in days
  estimatedBudget: number;
  tags: string[];
}

// Pre-built campaign templates
export const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'product-launch',
    name: 'Product Launch Sequence',
    description: 'Comprehensive product launch campaign across all platforms with teaser, launch, and follow-up content.',
    category: 'Product Marketing',
    platforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
    estimatedDuration: 14,
    estimatedBudget: 2500,
    tags: ['product', 'launch', 'sequence'],
    flow: {
      nodes: [
        {
          id: 'teaser-1',
          type: 'post',
          position: { x: 100, y: 100 },
          data: {
            content: 'Something exciting is coming... 🚀 Stay tuned for our big announcement next week!',
            platform: 'instagram',
            status: 'scheduled',
            scheduledTime: '2024-01-15T10:00:00Z',
          },
        },
        {
          id: 'teaser-2',
          type: 'post',
          position: { x: 300, y: 100 },
          data: {
            content: 'Behind the scenes of our latest project. Can you guess what we\'re working on? 👀',
            platform: 'facebook',
            status: 'scheduled',
            scheduledTime: '2024-01-16T14:00:00Z',
          },
        },
        {
          id: 'launch-post',
          type: 'post',
          position: { x: 500, y: 100 },
          data: {
            content: '🎉 WE\'RE LIVE! Introducing our newest product that will revolutionize how you work. Link in bio to learn more!',
            platform: 'instagram',
            status: 'scheduled',
            scheduledTime: '2024-01-20T12:00:00Z',
          },
        },
        {
          id: 'launch-ad',
          type: 'ad',
          position: { x: 700, y: 100 },
          data: {
            content: 'Transform your workflow with our new product. Early adopters save 30%!',
            platform: 'facebook',
            budget: 500,
            objective: 'traffic',
            status: 'scheduled',
          },
        },
        {
          id: 'followup-1',
          type: 'post',
          position: { x: 900, y: 100 },
          data: {
            content: 'Thank you to everyone who joined our launch! Here are some tips to get started with your new product.',
            platform: 'linkedin',
            status: 'scheduled',
            scheduledTime: '2024-01-22T09:00:00Z',
          },
        },
        {
          id: 'wait-1',
          type: 'wait',
          position: { x: 200, y: 200 },
          data: {
            duration: '24h',
          },
        },
        {
          id: 'wait-2',
          type: 'wait',
          position: { x: 400, y: 200 },
          data: {
            duration: '72h',
          },
        },
        {
          id: 'wait-3',
          type: 'wait',
          position: { x: 600, y: 200 },
          data: {
            duration: '48h',
          },
        },
        {
          id: 'goal',
          type: 'goal',
          position: { x: 1000, y: 100 },
          data: {
            target: '1000 sign-ups',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'teaser-1', target: 'wait-1' },
        { id: 'e2', source: 'wait-1', target: 'teaser-2' },
        { id: 'e3', source: 'teaser-2', target: 'wait-2' },
        { id: 'e4', source: 'wait-2', target: 'launch-post' },
        { id: 'e5', source: 'launch-post', target: 'launch-ad' },
        { id: 'e6', source: 'launch-ad', target: 'wait-3' },
        { id: 'e7', source: 'wait-3', target: 'followup-1' },
        { id: 'e8', source: 'followup-1', target: 'goal' },
      ],
      meta: {
        timezone: 'UTC',
        objectives: ['awareness', 'traffic', 'conversions'],
        platforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
      },
    },
  },
  {
    id: 'engagement-boost',
    name: '7-Day Engagement Drive',
    description: 'Boost engagement with interactive content, polls, and user-generated content campaigns.',
    category: 'Engagement',
    platforms: ['instagram', 'twitter', 'tiktok'],
    estimatedDuration: 7,
    estimatedBudget: 800,
    tags: ['engagement', 'interactive', 'community'],
    flow: {
      nodes: [
        {
          id: 'poll-1',
          type: 'post',
          position: { x: 100, y: 100 },
          data: {
            content: '📊 Quick poll: What\'s your biggest challenge this week? A) Time management B) Focus C) Motivation D) Work-life balance',
            platform: 'instagram',
            status: 'scheduled',
          },
        },
        {
          id: 'ugc-call',
          type: 'post',
          position: { x: 300, y: 100 },
          data: {
            content: 'Share your success stories with us! Tag us in your posts and we might feature you on our page! 💫 #CommunityWins',
            platform: 'twitter',
            status: 'scheduled',
          },
        },
        {
          id: 'qna-session',
          type: 'post',
          position: { x: 500, y: 100 },
          data: {
            content: '🎤 AMA Time! Drop your questions in the comments and we\'ll answer the most popular ones in our next post!',
            platform: 'tiktok',
            status: 'scheduled',
          },
        },
        {
          id: 'engagement-ad',
          type: 'ad',
          position: { x: 700, y: 100 },
          data: {
            content: 'Join our thriving community! See why thousands love being part of our network.',
            platform: 'instagram',
            budget: 200,
            objective: 'engagement',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'poll-1', target: 'ugc-call' },
        { id: 'e2', source: 'ugc-call', target: 'qna-session' },
        { id: 'e3', source: 'qna-session', target: 'engagement-ad' },
      ],
      meta: {
        timezone: 'UTC',
        objectives: ['engagement', 'community'],
        platforms: ['instagram', 'twitter', 'tiktok'],
      },
    },
  },
  {
    id: 'holiday-sale',
    name: 'Holiday Sale Campaign',
    description: 'Seasonal promotion campaign with flash sales, limited-time offers, and festive content.',
    category: 'Sales',
    platforms: ['facebook', 'instagram', 'twitter'],
    estimatedDuration: 10,
    estimatedBudget: 1500,
    tags: ['holiday', 'sale', 'promotion', 'seasonal'],
    flow: {
      nodes: [
        {
          id: 'announcement',
          type: 'post',
          position: { x: 100, y: 100 },
          data: {
            content: '🎄 Holiday Sale Alert! Starting tomorrow, enjoy up to 50% off on all products. Set your alarms! ⏰',
            platform: 'instagram',
            status: 'scheduled',
          },
        },
        {
          id: 'sale-launch',
          type: 'ad',
          position: { x: 300, y: 100 },
          data: {
            content: 'LIMITED TIME: Holiday Sale is LIVE! Use code HOLIDAY50 for 50% off. Don\'t miss out! 🎁',
            platform: 'facebook',
            budget: 600,
            objective: 'sales',
          },
        },
        {
          id: 'reminder-1',
          type: 'post',
          position: { x: 500, y: 100 },
          data: {
            content: '⏰ Only 48 hours left in our Holiday Sale! Last chance to save 50% on everything! #HolidaySale',
            platform: 'twitter',
            status: 'scheduled',
          },
        },
        {
          id: 'flash-sale',
          type: 'post',
          position: { x: 700, y: 100 },
          data: {
            content: '⚡ FLASH SALE: Next 2 hours only - additional 20% off with code FLASH20! Limited quantities!',
            platform: 'instagram',
            status: 'scheduled',
          },
        },
        {
          id: 'final-call',
          type: 'ad',
          position: { x: 900, y: 100 },
          data: {
            content: 'LAST CHANCE: Holiday Sale ends tonight! Final hours to save big before prices go back up.',
            platform: 'facebook',
            budget: 400,
            objective: 'sales',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'announcement', target: 'sale-launch' },
        { id: 'e2', source: 'sale-launch', target: 'reminder-1' },
        { id: 'e3', source: 'reminder-1', target: 'flash-sale' },
        { id: 'e4', source: 'flash-sale', target: 'final-call' },
      ],
      meta: {
        timezone: 'UTC',
        objectives: ['sales', 'traffic'],
        platforms: ['facebook', 'instagram', 'twitter'],
      },
    },
  },
  {
    id: 'brand-awareness',
    name: 'Brand Awareness Drive',
    description: 'Build brand recognition with educational content, behind-the-scenes, and thought leadership.',
    category: 'Brand Building',
    platforms: ['linkedin', 'facebook', 'youtube'],
    estimatedDuration: 21,
    estimatedBudget: 2000,
    tags: ['brand', 'awareness', 'education', 'thought-leadership'],
    flow: {
      nodes: [
        {
          id: 'thought-leadership',
          type: 'post',
          position: { x: 100, y: 100 },
          data: {
            content: '5 Trends Shaping Our Industry in 2024: A deep dive into what\'s changing and how to adapt.',
            platform: 'linkedin',
            status: 'scheduled',
          },
        },
        {
          id: 'bts-video',
          type: 'post',
          position: { x: 300, y: 100 },
          data: {
            content: 'Behind the scenes at our headquarters! See what a day in the life looks like for our team. 👥',
            platform: 'facebook',
            status: 'scheduled',
          },
        },
        {
          id: 'educational-series',
          type: 'post',
          position: { x: 500, y: 100 },
          data: {
            content: 'Part 1/3: Understanding Our Process - How we ensure quality in every product we deliver.',
            platform: 'linkedin',
            status: 'scheduled',
          },
        },
        {
          id: 'brand-video',
          type: 'post',
          position: { x: 700, y: 100 },
          data: {
            content: 'What drives us every day: Our mission to make a difference in people\'s lives.',
            platform: 'youtube',
            status: 'scheduled',
          },
        },
        {
          id: 'community-spotlight',
          type: 'post',
          position: { x: 900, y: 100 },
          data: {
            content: 'Shoutout to our amazing community! Thank you for being part of our journey. 💙 #CommunityLove',
            platform: 'facebook',
            status: 'scheduled',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'thought-leadership', target: 'bts-video' },
        { id: 'e2', source: 'bts-video', target: 'educational-series' },
        { id: 'e3', source: 'educational-series', target: 'brand-video' },
        { id: 'e4', source: 'brand-video', target: 'community-spotlight' },
      ],
      meta: {
        timezone: 'UTC',
        objectives: ['awareness', 'engagement'],
        platforms: ['linkedin', 'facebook', 'youtube'],
      },
    },
  },
  {
    id: 'event-countdown',
    name: 'Event Countdown Campaign',
    description: 'Generate excitement for upcoming events with teaser content and registration drives.',
    category: 'Events',
    platforms: ['facebook', 'instagram', 'linkedin', 'twitter'],
    estimatedDuration: 14,
    estimatedBudget: 1200,
    tags: ['event', 'countdown', 'registration', 'excitement'],
    flow: {
      nodes: [
        {
          id: 'announcement',
          type: 'post',
          position: { x: 100, y: 100 },
          data: {
            content: '📅 SAVE THE DATE: Join us for our biggest event of the year! More details coming soon...',
            platform: 'instagram',
            status: 'scheduled',
          },
        },
        {
          id: 'sneak-peek',
          type: 'post',
          position: { x: 300, y: 100 },
          data: {
            content: 'Sneak peek at what we have planned for our upcoming event! Can you guess what this is? 🤔',
            platform: 'twitter',
            status: 'scheduled',
          },
        },
        {
          id: 'speaker-announcement',
          type: 'post',
          position: { x: 500, y: 100 },
          data: {
            content: 'Excited to announce our keynote speakers! Industry leaders sharing insights you won\'t want to miss.',
            platform: 'linkedin',
            status: 'scheduled',
          },
        },
        {
          id: 'registration-drive',
          type: 'ad',
          position: { x: 700, y: 100 },
          data: {
            content: 'Early bird pricing ends soon! Register now for our upcoming event and save 40%.',
            platform: 'facebook',
            budget: 500,
            objective: 'leads',
          },
        },
        {
          id: 'final-reminder',
          type: 'post',
          position: { x: 900, y: 100 },
          data: {
            content: '🚨 LAST CALL: Event registration closes in 24 hours! Don\'t miss your chance to attend.',
            platform: 'instagram',
            status: 'scheduled',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'announcement', target: 'sneak-peek' },
        { id: 'e2', source: 'sneak-peek', target: 'speaker-announcement' },
        { id: 'e3', source: 'speaker-announcement', target: 'registration-drive' },
        { id: 'e4', source: 'registration-drive', target: 'final-reminder' },
      ],
      meta: {
        timezone: 'UTC',
        objectives: ['awareness', 'leads', 'engagement'],
        platforms: ['facebook', 'instagram', 'linkedin', 'twitter'],
      },
    },
  },
];

export function getTemplateById(id: string): CampaignTemplate | undefined {
  return campaignTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): CampaignTemplate[] {
  return campaignTemplates.filter(template => template.category === category);
}

export function getTemplatesByPlatform(platform: string): CampaignTemplate[] {
  return campaignTemplates.filter(template => template.platforms.includes(platform));
}

export function searchTemplates(query: string): CampaignTemplate[] {
  const lowerQuery = query.toLowerCase();
  return campaignTemplates.filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
