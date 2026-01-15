export interface Element {
  id: string;
  name: string;
  category: 'people' | 'objects' | 'nature' | 'food' | 'travel' | 'business' | 'tech' | 'shapes' | 'arrows' | 'social' | 'weather' | 'sports' | 'holidays';
  svg: string;
  tags: string[];
  source: 'Custom';
  color?: string;
}

export const ELEMENT_CATEGORIES = [
  { id: 'all', label: 'All', icon: '🎨' },
  { id: 'holidays', label: 'Holidays', icon: '🎉' },
  { id: 'people', label: 'People', icon: '👤' },
  { id: 'objects', label: 'Objects', icon: '📱' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'shapes', label: 'Shapes', icon: '🔷' },
  { id: 'arrows', label: 'Arrows', icon: '➡️' },
  { id: 'social', label: 'Social', icon: '💬' },
  { id: 'weather', label: 'Weather', icon: '☀️' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
];

// Professional Free SVG Graphics
// Sources: Heroicons, Bootstrap Icons, Feather Icons (all MIT licensed)
export const FREE_ELEMENTS: Element[] = [
  // TECH - Professional quality
  {
    id: 'smartphone-pro',
    name: 'Smartphone',
    category: 'tech',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#6366F1" stroke-width="1.5" fill="none"/><path d="M12 18h.01" stroke="#6366F1" stroke-width="2" stroke-linecap="round"/></svg>`,
    tags: ['phone', 'mobile', 'device', 'tech', 'smartphone'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'laptop-pro',
    name: 'Laptop',
    category: 'tech',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1" stroke="#8B5CF6" stroke-width="1.5" fill="none"/><path d="M2 20h20" stroke="#8B5CF6" stroke-width="1.5" stroke-linecap="round"/><path d="M6 16h12v4H6v-4z" fill="#8B5CF6" opacity="0.2"/></svg>`,
    tags: ['laptop', 'computer', 'tech', 'work', 'device'],
    source: 'Custom',
    color: '#8B5CF6',
  },
  {
    id: 'monitor-pro',
    name: 'Monitor',
    category: 'tech',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#3B82F6" stroke-width="1.5" fill="none"/><path d="M8 21h8M12 17v4" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['monitor', 'screen', 'display', 'tech', 'computer'],
    source: 'Custom',
    color: '#3B82F6',
  },

  // BUSINESS - Clean professional graphics
  {
    id: 'briefcase-pro',
    name: 'Briefcase',
    category: 'business',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#10B981" stroke-width="1.5" fill="none"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M12 12v3" stroke="#10B981" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['briefcase', 'business', 'work', 'professional', 'office'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'chart-pro',
    name: 'Chart',
    category: 'business',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/><path d="M7 14l4-4 3 3 5-5" stroke="#059669" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="14" r="1.5" fill="#059669"/><circle cx="11" cy="10" r="1.5" fill="#059669"/><circle cx="14" cy="13" r="1.5" fill="#059669"/><circle cx="19" cy="8" r="1.5" fill="#059669"/></svg>`,
    tags: ['chart', 'graph', 'analytics', 'business', 'data'],
    source: 'Custom',
    color: '#059669',
  },

  // NATURE - Beautiful organic shapes
  {
    id: 'tree-pro',
    name: 'Tree',
    category: 'nature',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l-4 6h2l-3 6h3v6h4v-6h3l-3-6h2l-4-6z" fill="#10B981" stroke="#059669" stroke-width="1" stroke-linejoin="round"/></svg>`,
    tags: ['tree', 'nature', 'plant', 'forest', 'green'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'flower-pro',
    name: 'Flower',
    category: 'nature',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" fill="#EC4899"/><circle cx="12" cy="7" r="2.5" fill="#F472B6" opacity="0.8"/><circle cx="17" cy="12" r="2.5" fill="#F472B6" opacity="0.8"/><circle cx="12" cy="17" r="2.5" fill="#F472B6" opacity="0.8"/><circle cx="7" cy="12" r="2.5" fill="#F472B6" opacity="0.8"/><path d="M12 12v9" stroke="#10B981" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['flower', 'nature', 'plant', 'bloom', 'garden'],
    source: 'Custom',
    color: '#EC4899',
  },

  // FOOD - Appetizing designs
  {
    id: 'pizza-pro',
    name: 'Pizza',
    category: 'food',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 12c0 5.5 4.5 10 10 10s10-4.5 10-10L12 2z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/><circle cx="10" cy="10" r="1.5" fill="#DC2626"/><circle cx="14" cy="12" r="1.5" fill="#DC2626"/><circle cx="11" cy="14" r="1.5" fill="#DC2626"/></svg>`,
    tags: ['pizza', 'food', 'italian', 'meal', 'restaurant'],
    source: 'Custom',
    color: '#F59E0B',
  },
  {
    id: 'coffee-pro',
    name: 'Coffee',
    category: 'food',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8h12a2 2 0 012 2v6a4 4 0 01-4 4H8a4 4 0 01-4-4v-6a2 2 0 012-2z" stroke="#92400E" stroke-width="1.5" fill="none"/><path d="M16 11h2a2 2 0 012 2v1a2 2 0 01-2 2h-2" stroke="#92400E" stroke-width="1.5" fill="none"/><path d="M7 4v2M11 4v2M15 4v2" stroke="#92400E" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['coffee', 'drink', 'cafe', 'beverage', 'morning'],
    source: 'Custom',
    color: '#92400E',
  },

  // HOLIDAYS - Christmas (Professional quality)
  {
    id: 'christmas-tree-pro',
    name: 'Christmas Tree',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l-4 6h2l-3 6h2l-4 7h14l-4-7h2l-3-6h2l-4-6z" fill="#10B981" stroke="#059669" stroke-width="1" stroke-linejoin="round"/><rect x="10" y="21" width="4" height="3" fill="#92400E"/><circle cx="12" cy="8" r="1" fill="#EF4444"/><circle cx="10" cy="13" r="1" fill="#F59E0B"/><circle cx="14" cy="15" r="1" fill="#3B82F6"/><path d="M12 1l1 2h-2l1-2z" fill="#FBBF24"/></svg>`,
    tags: ['christmas', 'tree', 'holiday', 'xmas', 'winter', 'festive'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'gift-pro',
    name: 'Gift Box',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="10" width="18" height="12" rx="1" fill="#EF4444" stroke="#DC2626" stroke-width="1.5"/><rect x="3" y="8" width="18" height="2" fill="#DC2626"/><path d="M12 8V22" stroke="#FBBF24" stroke-width="2"/><path d="M3 14h18" stroke="#FBBF24" stroke-width="2"/><path d="M12 8c0-2-1.5-3-3-3s-2 1-2 3h5z" fill="#10B981"/><path d="M12 8c0-2 1.5-3 3-3s2 1 2 3h-5z" fill="#10B981"/></svg>`,
    tags: ['gift', 'present', 'christmas', 'holiday', 'box'],
    source: 'Custom',
    color: '#EF4444',
  },
  {
    id: 'snowflake-pro',
    name: 'Snowflake',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v18M3 12h18M6.34 6.34l11.32 11.32M17.66 6.34L6.34 17.66" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#60A5FA"/><circle cx="12" cy="3" r="1" fill="#60A5FA"/><circle cx="12" cy="21" r="1" fill="#60A5FA"/><circle cx="3" cy="12" r="1" fill="#60A5FA"/><circle cx="21" cy="12" r="1" fill="#60A5FA"/><circle cx="6.34" cy="6.34" r="1" fill="#60A5FA"/><circle cx="17.66" cy="17.66" r="1" fill="#60A5FA"/><circle cx="17.66" cy="6.34" r="1" fill="#60A5FA"/><circle cx="6.34" cy="17.66" r="1" fill="#60A5FA"/></svg>`,
    tags: ['snowflake', 'snow', 'winter', 'christmas', 'cold'],
    source: 'Custom',
    color: '#60A5FA',
  },

  // HOLIDAYS - Halloween
  {
    id: 'pumpkin-pro',
    name: 'Pumpkin',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="14" rx="8" ry="7" fill="#F97316" stroke="#EA580C" stroke-width="1.5"/><path d="M12 7c1-1 2-1 3 0" stroke="#10B981" stroke-width="1.5" stroke-linecap="round"/><path d="M9 12l1 1-1 1M15 12l-1 1 1 1" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 17c1 1 2 1.5 3 1.5s2-.5 3-1.5" stroke="#000" stroke-width="1.5" stroke-linecap="round"/><path d="M12 7v14M8 9v10M16 9v10" stroke="#EA580C" stroke-width="1"/></svg>`,
    tags: ['pumpkin', 'halloween', 'fall', 'autumn', 'jack-o-lantern'],
    source: 'Custom',
    color: '#F97316',
  },
  {
    id: 'ghost-pro',
    name: 'Ghost',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10c0-3.5 2-6 5-6s5 2.5 5 6v10c0 .5-.5 1-1 1-.5 0-1-.5-1-1-.5.5-1 1-1.5 1s-1-.5-1.5-1c-.5.5-1 1-1.5 1s-1-.5-1.5-1c0 .5-.5 1-1 1-.5 0-1-.5-1-1V10z" fill="#fff" stroke="#E5E7EB" stroke-width="1.5"/><circle cx="10" cy="12" r="1" fill="#000"/><circle cx="14" cy="12" r="1" fill="#000"/><path d="M10 15c.5.5 1 .5 2 .5s1.5 0 2-.5" stroke="#000" stroke-width="1" stroke-linecap="round"/></svg>`,
    tags: ['ghost', 'halloween', 'spooky', 'boo', 'spirit'],
    source: 'Custom',
    color: '#FFFFFF',
  },

  // HOLIDAYS - Valentine's Day
  {
    id: 'heart-pro',
    name: 'Heart',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="#EF4444" stroke="#DC2626" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    tags: ['heart', 'love', 'valentine', 'romance', 'valentines day'],
    source: 'Custom',
    color: '#EF4444',
  },
  {
    id: 'rose-pro',
    name: 'Rose',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" fill="#EF4444" opacity="0.8"/><circle cx="10" cy="8" r="2" fill="#DC2626" opacity="0.6"/><circle cx="14" cy="8" r="2" fill="#DC2626" opacity="0.6"/><circle cx="12" cy="6" r="1.5" fill="#F87171"/><path d="M12 11v10" stroke="#10B981" stroke-width="2" stroke-linecap="round"/><path d="M12 14c-2 0-3 1-3 2" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M12 17c2 0 3 1 3 2" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
    tags: ['rose', 'flower', 'valentine', 'love', 'romance'],
    source: 'Custom',
    color: '#EF4444',
  },

  // HOLIDAYS - Easter
  {
    id: 'easter-egg-pro',
    name: 'Easter Egg',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="13" rx="6" ry="9" fill="#EC4899" stroke="#DB2777" stroke-width="1.5"/><path d="M6 10c2-1 4-1 6-1s4 0 6 1M6 14c2-1 4-1 6-1s4 0 6 1" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="8" r="0.8" fill="#FBBF24"/><circle cx="12" cy="17" r="0.8" fill="#FBBF24"/><circle cx="15" cy="12" r="0.8" fill="#FBBF24"/></svg>`,
    tags: ['easter', 'egg', 'spring', 'holiday', 'bunny'],
    source: 'Custom',
    color: '#EC4899',
  },

  // HOLIDAYS - St. Patrick's Day
  {
    id: 'shamrock-pro',
    name: 'Shamrock',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="3" fill="#10B981"/><circle cx="14" cy="10" r="3" fill="#10B981"/><circle cx="12" cy="13" r="3" fill="#10B981"/><path d="M12 16v6" stroke="#059669" stroke-width="2" stroke-linecap="round"/></svg>`,
    tags: ['shamrock', 'clover', 'st patricks day', 'irish', 'luck'],
    source: 'Custom',
    color: '#10B981',
  },

  // HOLIDAYS - 4th of July
  {
    id: 'firework-pro',
    name: 'Firework',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2" fill="#EF4444"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4M7.05 7.05l2.83 2.83M14.12 14.12l2.83 2.83M7.05 16.95l2.83-2.83M14.12 9.88l2.83-2.83" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="4" r="1" fill="#3B82F6"/><circle cx="12" cy="20" r="1" fill="#EF4444"/><circle cx="4" cy="12" r="1" fill="#FBBF24"/><circle cx="20" cy="12" r="1" fill="#3B82F6"/></svg>`,
    tags: ['firework', 'fireworks', '4th of july', 'independence day', 'celebration'],
    source: 'Custom',
    color: '#EF4444',
  },

  // HOLIDAYS - Birthday
  {
    id: 'birthday-cake-pro',
    name: 'Birthday Cake',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="12" width="12" height="8" rx="1" fill="#EC4899" stroke="#DB2777" stroke-width="1.5"/><rect x="5" y="11" width="14" height="1" fill="#DB2777"/><path d="M7 13h10" stroke="#fff" stroke-width="1"/><rect x="8" y="20" width="8" height="2" rx="0.5" fill="#F59E0B"/><path d="M10 8v3M14 8v3" stroke="#FBBF24" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="10" cy="7" rx="1" ry="2" fill="#F59E0B"/><ellipse cx="14" cy="7" rx="1" ry="2" fill="#F59E0B"/></svg>`,
    tags: ['cake', 'birthday', 'celebration', 'party', 'dessert'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'balloon-pro',
    name: 'Balloon',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="9" rx="5" ry="6" fill="#EF4444" stroke="#DC2626" stroke-width="1.5"/><path d="M12 15c-.5 1-1 2-1 3v3" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" fill="none"/><ellipse cx="10" cy="6" rx="1.5" ry="2" fill="#FCA5A5" opacity="0.5"/></svg>`,
    tags: ['balloon', 'party', 'birthday', 'celebration', 'festive'],
    source: 'Custom',
    color: '#EF4444',
  },

  // SHAPES - Clean geometric
  {
    id: 'circle-pro',
    name: 'Circle',
    category: 'shapes',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#3B82F6" stroke-width="2" fill="none"/></svg>`,
    tags: ['circle', 'shape', 'round', 'geometric'],
    source: 'Custom',
    color: '#3B82F6',
  },
  {
    id: 'square-pro',
    name: 'Square',
    category: 'shapes',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="1" stroke="#10B981" stroke-width="2" fill="none"/></svg>`,
    tags: ['square', 'shape', 'rectangle', 'geometric'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'star-pro',
    name: 'Star',
    category: 'shapes',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    tags: ['star', 'shape', 'favorite', 'rating'],
    source: 'Custom',
    color: '#FBBF24',
  },

  // ARROWS - Professional
  {
    id: 'arrow-right-pro',
    name: 'Arrow Right',
    category: 'arrows',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['arrow', 'right', 'direction', 'next'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'arrow-up-pro',
    name: 'Arrow Up',
    category: 'arrows',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M5 12l7-7 7 7" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['arrow', 'up', 'direction', 'increase'],
    source: 'Custom',
    color: '#10B981',
  },

  // SOCIAL - Modern
  {
    id: 'chat-pro',
    name: 'Chat Bubble',
    category: 'social',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['chat', 'message', 'social', 'communication'],
    source: 'Custom',
    color: '#3B82F6',
  },

  // WEATHER - Clean
  {
    id: 'sun-pro',
    name: 'Sun',
    category: 'weather',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" fill="#F59E0B"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/></svg>`,
    tags: ['sun', 'weather', 'sunny', 'day', 'bright'],
    source: 'Custom',
    color: '#F59E0B',
  },
  {
    id: 'cloud-pro',
    name: 'Cloud',
    category: 'weather',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['cloud', 'weather', 'cloudy', 'sky'],
    source: 'Custom',
    color: '#60A5FA',
  },

  // SPORTS
  {
    id: 'soccer-pro',
    name: 'Soccer Ball',
    category: 'sports',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#000" stroke-width="1.5" fill="#fff"/><path d="M12 3l2 4h-4l2-4zM5 8l3 2-1 4-3-2 1-4zM19 8l-3 2 1 4 3-2-1-4zM8 17l4 2v4l-4-2v-4zM16 17l-4 2v4l4-2v-4z" fill="#000"/></svg>`,
    tags: ['soccer', 'football', 'ball', 'sports', 'game'],
    source: 'Custom',
    color: '#000000',
  },

  // TRAVEL
  {
    id: 'airplane-pro',
    name: 'Airplane',
    category: 'travel',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#3B82F6" stroke="#2563EB" stroke-width="1" stroke-linejoin="round"/></svg>`,
    tags: ['airplane', 'plane', 'travel', 'flight', 'aviation'],
    source: 'Custom',
    color: '#3B82F6',
  },
  {
    id: 'map-pin-pro',
    name: 'Map Pin',
    category: 'travel',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="10" r="3" stroke="#EF4444" stroke-width="1.5" fill="none"/></svg>`,
    tags: ['map', 'pin', 'location', 'place', 'travel'],
    source: 'Custom',
    color: '#EF4444',
  },

  // PEOPLE
  {
    id: 'user-pro',
    name: 'User',
    category: 'people',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="#6366F1" stroke-width="1.5"/></svg>`,
    tags: ['user', 'person', 'profile', 'account', 'people'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'users-pro',
    name: 'Users',
    category: 'people',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="#6366F1" stroke-width="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['users', 'people', 'group', 'team', 'community'],
    source: 'Custom',
    color: '#6366F1',
  },

  // OBJECTS
  {
    id: 'camera-pro',
    name: 'Camera',
    category: 'objects',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" stroke="#8B5CF6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="13" r="4" stroke="#8B5CF6" stroke-width="1.5"/></svg>`,
    tags: ['camera', 'photo', 'picture', 'photography', 'device'],
    source: 'Custom',
    color: '#8B5CF6',
  },
  {
    id: 'music-pro',
    name: 'Music Note',
    category: 'objects',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13" stroke="#EC4899" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" stroke="#EC4899" stroke-width="1.5"/><circle cx="18" cy="16" r="3" stroke="#EC4899" stroke-width="1.5"/></svg>`,
    tags: ['music', 'note', 'audio', 'sound', 'song'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'book-pro',
    name: 'Book',
    category: 'objects',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['book', 'read', 'library', 'education', 'learning'],
    source: 'Custom',
    color: '#3B82F6',
  },
  {
    id: 'lightbulb-pro',
    name: 'Light Bulb',
    category: 'objects',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21h6M12 3a6 6 0 00-6 6c0 3.74 2.01 5.61 3 6.5V18a1 1 0 001 1h4a1 1 0 001-1v-2.5c.99-.89 3-2.76 3-6.5a6 6 0 00-6-6z" stroke="#FBBF24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['lightbulb', 'idea', 'innovation', 'creative', 'think'],
    source: 'Custom',
    color: '#FBBF24',
  },
  {
    id: 'clock-pro',
    name: 'Clock',
    category: 'objects',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#6366F1" stroke-width="1.5"/><path d="M12 7v5l3 3" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['clock', 'time', 'watch', 'schedule', 'hour'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'trophy-pro',
    name: 'Trophy',
    category: 'objects',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H4.5A2.5 2.5 0 012 6.5V6a2 2 0 012-2h2M18 9h1.5A2.5 2.5 0 0022 6.5V6a2 2 0 00-2-2h-2" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 4H6v7a6 6 0 0012 0V4z" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 17v3M8 20h8" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['trophy', 'award', 'winner', 'achievement', 'prize'],
    source: 'Custom',
    color: '#F59E0B',
  },
  {
    id: 'key-pro',
    name: 'Key',
    category: 'objects',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['key', 'security', 'lock', 'access', 'password'],
    source: 'Custom',
    color: '#10B981',
  },

  // MORE TECH
  {
    id: 'tablet-pro',
    name: 'Tablet',
    category: 'tech',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="16" height="20" rx="2" stroke="#8B5CF6" stroke-width="1.5" fill="none"/><path d="M12 18h.01" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round"/></svg>`,
    tags: ['tablet', 'ipad', 'device', 'tech', 'mobile'],
    source: 'Custom',
    color: '#8B5CF6',
  },
  {
    id: 'headphones-pro',
    name: 'Headphones',
    category: 'tech',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 18v-6a9 9 0 0118 0v6" stroke="#EC4899" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" stroke="#EC4899" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['headphones', 'audio', 'music', 'sound', 'listen'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'wifi-pro',
    name: 'WiFi',
    category: 'tech',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.55a11 11 0 0114.08 0M8.53 16.11a6 6 0 016.95 0M12 20h.01M1.42 9a16 16 0 0121.16 0" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['wifi', 'wireless', 'internet', 'connection', 'network'],
    source: 'Custom',
    color: '#3B82F6',
  },

  // MORE FOOD
  {
    id: 'burger-pro',
    name: 'Burger',
    category: 'food',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11h18M3 11c0-2.21 1.79-4 4-4h10c2.21 0 4 1.79 4 4M3 11v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['burger', 'hamburger', 'food', 'fast food', 'meal'],
    source: 'Custom',
    color: '#F59E0B',
  },
  {
    id: 'ice-cream-pro',
    name: 'Ice Cream',
    category: 'food',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22l-4-8h8l-4 8z" fill="#F472B6" stroke="#EC4899" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="8" r="5" fill="#FCA5A5" stroke="#EF4444" stroke-width="1.5"/><circle cx="12" cy="6" r="2" fill="#fff" opacity="0.5"/></svg>`,
    tags: ['ice cream', 'dessert', 'sweet', 'food', 'cone'],
    source: 'Custom',
    color: '#F472B6',
  },

  // MORE NATURE
  {
    id: 'leaf-pro',
    name: 'Leaf',
    category: 'nature',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['leaf', 'nature', 'plant', 'green', 'eco'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'mountain-pro',
    name: 'Mountain',
    category: 'nature',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 20h18L12 4 3 20z" fill="#6366F1" opacity="0.3" stroke="#6366F1" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 20l7-12 6 12" fill="#8B5CF6" opacity="0.5" stroke="#8B5CF6" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    tags: ['mountain', 'nature', 'landscape', 'hiking', 'outdoor'],
    source: 'Custom',
    color: '#6366F1',
  },

  // MORE WEATHER
  {
    id: 'rain-pro',
    name: 'Rain',
    category: 'weather',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M8 19v2M12 19v2M16 19v2" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['rain', 'weather', 'rainy', 'water', 'storm'],
    source: 'Custom',
    color: '#60A5FA',
  },
  {
    id: 'moon-pro',
    name: 'Moon',
    category: 'weather',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['moon', 'night', 'dark', 'weather', 'lunar'],
    source: 'Custom',
    color: '#FBBF24',
  },
  {
    id: 'lightning-pro',
    name: 'Lightning',
    category: 'weather',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    tags: ['lightning', 'thunder', 'storm', 'weather', 'bolt'],
    source: 'Custom',
    color: '#FBBF24',
  },

  // MORE ARROWS
  {
    id: 'arrow-left-pro',
    name: 'Arrow Left',
    category: 'arrows',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['arrow', 'left', 'direction', 'back', 'previous'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'arrow-down-pro',
    name: 'Arrow Down',
    category: 'arrows',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M19 12l-7 7-7-7" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['arrow', 'down', 'direction', 'decrease', 'download'],
    source: 'Custom',
    color: '#EF4444',
  },

  // MORE SOCIAL
  {
    id: 'mail-pro',
    name: 'Mail',
    category: 'social',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M22 6l-10 7L2 6" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['mail', 'email', 'message', 'envelope', 'contact'],
    source: 'Custom',
    color: '#3B82F6',
  },
  {
    id: 'phone-pro',
    name: 'Phone',
    category: 'social',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['phone', 'call', 'telephone', 'contact', 'mobile'],
    source: 'Custom',
    color: '#10B981',
  },

  // MORE SPORTS
  {
    id: 'basketball-pro',
    name: 'Basketball',
    category: 'sports',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#F97316" stroke-width="1.5" fill="none"/><path d="M12 3v18M3 12h18M6.34 6.34a9 9 0 0111.32 0M6.34 17.66a9 9 0 0011.32 0" stroke="#F97316" stroke-width="1.5"/></svg>`,
    tags: ['basketball', 'sports', 'ball', 'game', 'hoop'],
    source: 'Custom',
    color: '#F97316',
  },

  // MORE BUSINESS
  {
    id: 'dollar-pro',
    name: 'Dollar Sign',
    category: 'business',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['dollar', 'money', 'currency', 'business', 'finance'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'target-pro',
    name: 'Target',
    category: 'business',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#EF4444" stroke-width="1.5"/><circle cx="12" cy="12" r="6" stroke="#EF4444" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="#EF4444"/></svg>`,
    tags: ['target', 'goal', 'aim', 'business', 'focus'],
    source: 'Custom',
    color: '#EF4444',
  },

  // MORE SHAPES
  {
    id: 'triangle-pro',
    name: 'Triangle',
    category: 'shapes',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l10 20H2L12 2z" stroke="#EC4899" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['triangle', 'shape', 'geometric', 'polygon'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'hexagon-pro',
    name: 'Hexagon',
    category: 'shapes',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#8B5CF6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    tags: ['hexagon', 'shape', 'geometric', 'polygon'],
    source: 'Custom',
    color: '#8B5CF6',
  },

  // MORE HOLIDAYS
  {
    id: 'candy-pro',
    name: 'Candy',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="8" height="8" rx="1" fill="#EC4899" stroke="#DB2777" stroke-width="1.5" transform="rotate(45 12 12)"/><path d="M4 12l4-4M20 12l-4-4M12 4l-4 4M12 20l4-4" stroke="#EC4899" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    tags: ['candy', 'sweet', 'halloween', 'treat', 'sugar'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'sparkles-pro',
    name: 'Sparkles',
    category: 'holidays',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1" stroke-linejoin="round"/></svg>`,
    tags: ['sparkles', 'stars', 'celebration', 'magic', 'festive'],
    source: 'Custom',
    color: '#FBBF24',
  },

  // PROFESSIONAL ILLUSTRATIONS (Open Doodles/unDraw Style - MIT/CC0 Compatible)
  {
    id: 'working-from-home',
    name: 'Working From Home',
    category: 'people',
    svg: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="400" fill="#F8F9FA"/><ellipse cx="250" cy="380" rx="150" ry="15" fill="#000" opacity="0.06"/><rect x="150" y="280" width="200" height="100" rx="8" fill="#6366F1" opacity="0.1"/><rect x="170" y="240" width="160" height="50" rx="4" fill="#1E293B"/><circle cx="180" cy="250" r="4" fill="#EF4444"/><circle cx="192" cy="250" r="4" fill="#FBBF24"/><circle cx="204" cy="250" r="4" fill="#10B981"/><rect x="180" y="262" width="60" height="4" rx="2" fill="#6366F1" opacity="0.5"/><rect x="180" y="270" width="50" height="4" rx="2" fill="#6366F1" opacity="0.5"/><rect x="180" y="278" width="55" height="4" rx="2" fill="#6366F1" opacity="0.5"/><circle cx="250" cy="140" r="30" fill="#FBBF24"/><circle cx="240" cy="135" r="4" fill="#1F2937"/><circle cx="260" cy="135" r="4" fill="#1F2937"/><path d="M242 150c4 4 10 4 16 0" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M220 170c0-16 13-28 30-28s30 12 30 28v40h-60v-40z" fill="#6366F1"/><rect x="205" y="210" width="15" height="45" rx="7" fill="#FBBF24"/><rect x="280" y="210" width="15" height="45" rx="7" fill="#FBBF24"/><path d="M212 255c-8 20-15 35-18 50M287 255c8 20 15 35 18 50" stroke="#4F46E5" stroke-width="8" stroke-linecap="round"/><rect x="310" y="250" width="50" height="45" rx="4" fill="#DBEAFE"/><circle cx="325" cy="265" r="6" fill="#3B82F6"/><rect x="315" y="275" width="35" height="3" rx="1.5" fill="#3B82F6" opacity="0.4"/><rect x="315" y="282" width="30" height="3" rx="1.5" fill="#3B82F6" opacity="0.4"/><rect x="315" y="289" width="32" height="3" rx="1.5" fill="#3B82F6" opacity="0.4"/><circle cx="400" cy="100" r="50" fill="#FCD34D" opacity="0.3"/><path d="M100 320c20-10 40-15 60-15s40 5 60 15" stroke="#10B981" stroke-width="3" fill="none" opacity="0.3"/></svg>`,
    tags: ['working', 'home', 'remote', 'desk', 'office', 'professional', 'illustration', 'people'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'team-meeting',
    name: 'Team Meeting',
    category: 'business',
    svg: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="400" fill="#F8F9FA"/><ellipse cx="250" cy="385" rx="180" ry="12" fill="#000" opacity="0.06"/><circle cx="150" cy="150" r="28" fill="#FCA5A5"/><circle cx="142" cy="145" r="4" fill="#1F2937"/><circle cx="158" cy="145" r="4" fill="#1F2937"/><path d="M122 178c0-15 12-26 28-26s28 11 28 26v35h-56v-35z" fill="#3B82F6"/><rect x="108" y="213" width="14" height="50" rx="7" fill="#FCA5A5"/><rect x="164" y="213" width="14" height="50" rx="7" fill="#FCA5A5"/><path d="M115 263c-7 18-13 32-16 45M171 263c7 18 13 32 16 45" stroke="#2563EB" stroke-width="7" stroke-linecap="round"/><circle cx="350" cy="150" r="28" fill="#FBBF24"/><circle cx="342" cy="145" r="4" fill="#1F2937"/><circle cx="358" cy="145" r="4" fill="#1F2937"/><path d="M322 178c0-15 12-26 28-26s28 11 28 26v35h-56v-35z" fill="#F59E0B"/><rect x="308" y="213" width="14" height="50" rx="7" fill="#FBBF24"/><rect x="364" y="213" width="14" height="50" rx="7" fill="#FBBF24"/><path d="M315 263c-7 18-13 32-16 45M371 263c7 18 13 32 16 45" stroke="#D97706" stroke-width="7" stroke-linecap="round"/><circle cx="250" cy="190" r="28" fill="#93C5FD"/><circle cx="242" cy="185" r="4" fill="#1F2937"/><circle cx="258" cy="185" r="4" fill="#1F2937"/><path d="M222 218c0-15 12-26 28-26s28 11 28 26v35h-56v-35z" fill="#6366F1"/><rect x="208" y="253" width="14" height="50" rx="7" fill="#93C5FD"/><rect x="264" y="253" width="14" height="50" rx="7" fill="#93C5FD"/><path d="M215 303c-7 15-13 28-16 40M271 303c7 15 13 28 16 40" stroke="#4F46E5" stroke-width="7" stroke-linecap="round"/><rect x="180" y="80" width="140" height="90" rx="6" fill="#F3F4F6" stroke="#6366F1" stroke-width="3"/><path d="M195 105h110M195 120h90M195 135h100" stroke="#6366F1" stroke-width="3" stroke-linecap="round"/><circle cx="210" cy="150" r="6" fill="#10B981"/><circle cx="230" cy="150" r="6" fill="#3B82F6"/><circle cx="250" cy="150" r="6" fill="#F59E0B"/></svg>`,
    tags: ['team', 'meeting', 'collaboration', 'business', 'group', 'presentation', 'illustration'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'business',
    svg: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="400" fill="#F8F9FA"/><ellipse cx="250" cy="385" rx="160" ry="12" fill="#000" opacity="0.06"/><rect x="80" y="100" width="340" height="250" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="3"/><rect x="90" y="320" width="320" height="4" rx="2" fill="#D1D5DB"/><rect x="90" y="150" width="4" height="170" rx="2" fill="#D1D5DB"/><path d="M110 300L150 250L200 270L260 180L310 200L370 130" stroke="#10B981" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="110" cy="300" r="8" fill="#10B981" stroke="#fff" stroke-width="3"/><circle cx="150" cy="250" r="8" fill="#10B981" stroke="#fff" stroke-width="3"/><circle cx="200" cy="270" r="8" fill="#10B981" stroke="#fff" stroke-width="3"/><circle cx="260" cy="180" r="8" fill="#10B981" stroke="#fff" stroke-width="3"/><circle cx="310" cy="200" r="8" fill="#10B981" stroke="#fff" stroke-width="3"/><circle cx="370" cy="130" r="8" fill="#10B981" stroke="#fff" stroke-width="3"/><path d="M355 130l20-12 8 20z" fill="#10B981"/><rect x="100" y="327" width="15" height="3" fill="#9CA3AF"/><rect x="145" y="327" width="15" height="3" fill="#9CA3AF"/><rect x="195" y="327" width="15" height="3" fill="#9CA3AF"/><rect x="255" y="327" width="15" height="3" fill="#9CA3AF"/><rect x="305" y="327" width="15" height="3" fill="#9CA3AF"/><rect x="365" y="327" width="15" height="3" fill="#9CA3AF"/><circle cx="380" cy="60" r="45" fill="#6366F1" opacity="0.1"/><circle cx="380" cy="60" r="30" fill="#6366F1" opacity="0.15"/><path d="M370 50l10 10 20-20" stroke="#6366F1" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['data', 'analysis', 'chart', 'graph', 'analytics', 'business', 'growth', 'illustration'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'coding-developer',
    name: 'Developer Coding',
    category: 'tech',
    svg: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="400" fill="#F8F9FA"/><ellipse cx="250" cy="385" rx="140" ry="12" fill="#000" opacity="0.06"/><rect x="100" y="120" width="300" height="200" rx="8" fill="#1E293B" stroke="#6366F1" stroke-width="4"/><circle cx="115" cy="135" r="5" fill="#EF4444"/><circle cx="130" cy="135" r="5" fill="#FBBF24"/><circle cx="145" cy="135" r="5" fill="#10B981"/><path d="M130 165l20 20-20 20M220 165l-20 20 20 20" stroke="#6366F1" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="260" y="175" width="100" height="5" rx="2.5" fill="#6366F1" opacity="0.6"/><rect x="260" y="190" width="80" height="5" rx="2.5" fill="#6366F1" opacity="0.6"/><rect x="260" y="205" width="90" height="5" rx="2.5" fill="#6366F1" opacity="0.6"/><rect x="130" y="225" width="70" height="5" rx="2.5" fill="#10B981" opacity="0.6"/><rect x="130" y="240" width="90" height="5" rx="2.5" fill="#10B981" opacity="0.6"/><rect x="130" y="255" width="60" height="5" rx="2.5" fill="#10B981" opacity="0.6"/><circle cx="350" cy="240" r="35" fill="#FBBF24"/><circle cx="340" cy="235" r="5" fill="#1F2937"/><circle cx="360" cy="235" r="5" fill="#1F2937"/><path d="M342 250c5 5 11 5 16 0" stroke="#1F2937" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M315 275c0-19 15-33 35-33s35 14 35 33v40h-70v-40z" fill="#6366F1"/><rect x="298" y="315" width="18" height="55" rx="9" fill="#FBBF24"/><rect x="354" y="315" width="18" height="55" rx="9" fill="#FBBF24"/><path d="M307 370c-10 8-18 12-25 15M363 370c10 8 18 12 25 15" stroke="#4F46E5" stroke-width="9" stroke-linecap="round"/><circle cx="100" cy="80" r="40" fill="#FCD34D" opacity="0.25"/></svg>`,
    tags: ['coding', 'developer', 'programming', 'tech', 'computer', 'software', 'illustration'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'creative-design',
    name: 'Creative Design',
    category: 'objects',
    svg: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="400" fill="#F8F9FA"/><ellipse cx="250" cy="385" rx="150" ry="12" fill="#000" opacity="0.06"/><rect x="100" y="250" width="300" height="135" rx="6" fill="#6B7280"/><rect x="120" y="180" width="260" height="75" rx="5" fill="#1E293B" stroke="#6366F1" stroke-width="3"/><circle cx="132" cy="192" r="4" fill="#EF4444"/><circle cx="144" cy="192" r="4" fill="#FBBF24"/><circle cx="156" cy="192" r="4" fill="#10B981"/><rect x="130" y="205" width="80" height="4" rx="2" fill="#6366F1" opacity="0.4"/><rect x="130" y="215" width="65" height="4" rx="2" fill="#6366F1" opacity="0.4"/><rect x="130" y="225" width="75" height="4" rx="2" fill="#6366F1" opacity="0.4"/><rect x="230" y="205" width="130" height="40" rx="3" fill="#6366F1" opacity="0.2"/><circle cx="250" cy="225" r="10" fill="#6366F1"/><rect x="270" y="215" width="80" height="4" rx="2" fill="#6366F1" opacity="0.5"/><rect x="270" y="225" width="70" height="4" rx="2" fill="#6366F1" opacity="0.5"/><rect x="270" y="235" width="75" height="4" rx="2" fill="#6366F1" opacity="0.5"/><rect x="320" y="200" width="45" height="50" rx="3" fill="#DBEAFE"/><circle cx="335" cy="215" r="7" fill="#3B82F6"/><rect x="325" y="228" width="30" height="3" rx="1.5" fill="#3B82F6" opacity="0.4"/><rect x="325" y="235" width="25" height="3" rx="1.5" fill="#3B82F6" opacity="0.4"/><rect x="325" y="242" width="28" height="3" rx="1.5" fill="#3B82F6" opacity="0.4"/><circle cx="420" cy="120" r="55" fill="#FBBF24" opacity="0.25"/><circle cx="420" cy="120" r="35" fill="#FBBF24" opacity="0.35"/><path d="M420 85v35M405 120h30" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><path d="M150 300c30-15 60-20 90-20s60 5 90 20" stroke="#10B981" stroke-width="4" fill="none" opacity="0.3"/><circle cx="180" cy="100" r="25" fill="#EC4899" opacity="0.2"/><circle cx="180" cy="100" r="15" fill="#EC4899" opacity="0.3"/></svg>`,
    tags: ['design', 'creative', 'workspace', 'desk', 'computer', 'work', 'illustration'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'online-shopping',
    name: 'Online Shopping',
    category: 'objects',
    svg: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="400" fill="#F8F9FA"/><ellipse cx="250" cy="385" rx="140" ry="12" fill="#000" opacity="0.06"/><rect x="150" y="120" width="200" height="180" rx="6" fill="#fff" stroke="#E5E7EB" stroke-width="3"/><rect x="165" y="140" width="170" height="100" rx="4" fill="#DBEAFE"/><circle cx="250" cy="190" r="25" fill="#3B82F6"/><path d="M240 190l7 7 15-15" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="175" y="255" width="150" height="8" rx="4" fill="#E5E7EB"/><rect x="175" y="270" width="120" height="8" rx="4" fill="#E5E7EB"/><rect x="240" y="320" width="80" height="35" rx="6" fill="#3B82F6"/><path d="M260 337.5h40" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M280 327.5v20" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M100 200l30-40 30 40-30 40z" fill="#F59E0B" opacity="0.3"/><path d="M400 180l-30 40-30-40 30-40z" fill="#EC4899" opacity="0.3"/><circle cx="380" cy="280" r="35" fill="#10B981" opacity="0.2"/><circle cx="120" cy="320" r="30" fill="#6366F1" opacity="0.2"/></svg>`,
    tags: ['shopping', 'cart', 'ecommerce', 'online', 'store', 'buy', 'illustration'],
    source: 'Custom',
    color: '#3B82F6',
  },

];

export function getElementsByCategory(category: string): Element[] {
  if (category === 'all') return FREE_ELEMENTS;
  return FREE_ELEMENTS.filter(el => el.category === category);
}

export function searchElements(query: string): Element[] {
  const lowerQuery = query.toLowerCase();
  return FREE_ELEMENTS.filter(el =>
    el.name.toLowerCase().includes(lowerQuery) ||
    el.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getElementSVGDataURL(svg: string): string {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}
