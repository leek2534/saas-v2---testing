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

// Free SVG elements (no API needed!)
export const FREE_ELEMENTS: Element[] = [
  {
    id: 'phone-1',
    name: 'Smartphone',
    category: 'tech',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="10" width="50" height="80" rx="5" fill="#6366F1"/><rect x="30" y="15" width="40" height="60" fill="#fff"/><circle cx="50" cy="82" r="3" fill="#fff"/></svg>`,
    tags: ['phone', 'mobile', 'device', 'tech', 'smartphone'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'laptop-1',
    name: 'Laptop',
    category: 'tech',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="20" width="70" height="50" rx="3" fill="#8B5CF6"/><rect x="20" y="25" width="60" height="35" fill="#fff"/><rect x="10" y="70" width="80" height="5" rx="2" fill="#8B5CF6"/></svg>`,
    tags: ['laptop', 'computer', 'tech', 'work', 'device'],
    source: 'Custom',
    color: '#8B5CF6',
  },
  {
    id: 'person-working',
    name: 'Person Working',
    category: 'people',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="30" r="12" fill="#EC4899"/><rect x="40" y="45" width="20" height="30" rx="3" fill="#EC4899"/><rect x="35" y="50" width="10" height="20" rx="2" fill="#EC4899" opacity="0.7"/><rect x="55" y="50" width="10" height="20" rx="2" fill="#EC4899" opacity="0.7"/></svg>`,
    tags: ['person', 'work', 'office', 'business', 'professional'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'home-1',
    name: 'House',
    category: 'travel',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,20 80,45 80,80 20,80 20,45" fill="#F59E0B"/><rect x="35" y="55" width="30" height="25" fill="#fff"/><rect x="42" y="62" width="16" height="10" fill="#6366F1"/></svg>`,
    tags: ['home', 'house', 'building', 'real estate', 'property'],
    source: 'Custom',
    color: '#F59E0B',
  },
  {
    id: 'star-1',
    name: 'Star',
    category: 'shapes',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,15 61,40 88,40 67,55 75,80 50,65 25,80 33,55 12,40 39,40" fill="#EAB308"/></svg>`,
    tags: ['star', 'favorite', 'rating', 'icon', 'award'],
    source: 'Custom',
    color: '#EAB308',
  },
  {
    id: 'chart-1',
    name: 'Bar Chart',
    category: 'business',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="50" width="15" height="35" fill="#10B981"/><rect x="35" y="30" width="15" height="55" fill="#10B981"/><rect x="55" y="40" width="15" height="45" fill="#10B981"/><rect x="75" y="20" width="15" height="65" fill="#10B981"/></svg>`,
    tags: ['chart', 'graph', 'data', 'analytics', 'statistics'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'car-1',
    name: 'Car',
    category: 'objects',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="45" width="60" height="25" rx="5" fill="#3B82F6"/><rect x="30" y="35" width="40" height="15" rx="3" fill="#3B82F6"/><circle cx="32" cy="70" r="8" fill="#1F2937"/><circle cx="68" cy="70" r="8" fill="#1F2937"/></svg>`,
    tags: ['car', 'vehicle', 'transport', 'auto', 'automobile'],
    source: 'Custom',
    color: '#3B82F6',
  },
  {
    id: 'paint-1',
    name: 'Paint Palette',
    category: 'shapes',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="35" ry="30" fill="#A855F7"/><circle cx="35" cy="40" r="5" fill="#EF4444"/><circle cx="50" cy="35" r="5" fill="#F59E0B"/><circle cx="65" cy="40" r="5" fill="#10B981"/><circle cx="45" cy="55" r="5" fill="#3B82F6"/><circle cx="60" cy="55" r="5" fill="#EC4899"/></svg>`,
    tags: ['paint', 'art', 'creative', 'design', 'palette'],
    source: 'Custom',
    color: '#A855F7',
  },
  {
    id: 'coffee-1',
    name: 'Coffee Cup',
    category: 'objects',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="35" width="40" height="45" rx="5" fill="#92400E"/><rect x="35" y="40" width="30" height="35" fill="#78350F"/><path d="M 70 45 Q 80 45 80 55 Q 80 65 70 65" stroke="#92400E" stroke-width="3" fill="none"/><path d="M 35 30 Q 40 20 45 30" stroke="#92400E" stroke-width="2" fill="none"/><path d="M 50 30 Q 55 20 60 30" stroke="#92400E" stroke-width="2" fill="none"/></svg>`,
    tags: ['coffee', 'cup', 'drink', 'beverage', 'cafe'],
    source: 'Custom',
    color: '#92400E',
  },
  {
    id: 'book-1',
    name: 'Book',
    category: 'objects',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="20" width="50" height="60" rx="3" fill="#DC2626"/><rect x="30" y="25" width="40" height="50" fill="#FEE2E2"/><line x1="50" y1="25" x2="50" y2="75" stroke="#DC2626" stroke-width="1"/></svg>`,
    tags: ['book', 'read', 'education', 'learning', 'library'],
    source: 'Custom',
    color: '#DC2626',
  },
  {
    id: 'lightbulb-1',
    name: 'Light Bulb',
    category: 'business',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="40" r="20" fill="#FBBF24"/><rect x="45" y="60" width="10" height="15" rx="2" fill="#78716C"/><rect x="42" y="75" width="16" height="5" rx="2" fill="#78716C"/></svg>`,
    tags: ['lightbulb', 'idea', 'innovation', 'creative', 'thinking'],
    source: 'Custom',
    color: '#FBBF24',
  },
  {
    id: 'heart-1',
    name: 'Heart',
    category: 'social',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 80 C 50 80 20 60 20 40 C 20 25 30 20 40 25 C 45 27 50 32 50 32 C 50 32 55 27 60 25 C 70 20 80 25 80 40 C 80 60 50 80 50 80 Z" fill="#EF4444"/></svg>`,
    tags: ['heart', 'love', 'like', 'favorite', 'health'],
    source: 'Custom',
    color: '#EF4444',
  },
  {
    id: 'rocket-1',
    name: 'Rocket',
    category: 'travel',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 60,40 50,35 40,40" fill="#6366F1"/><rect x="45" y="35" width="10" height="40" rx="2" fill="#6366F1"/><polygon points="40,50 35,65 45,60" fill="#EF4444"/><polygon points="60,50 65,65 55,60" fill="#EF4444"/><polygon points="45,75 50,85 55,75" fill="#F59E0B"/></svg>`,
    tags: ['rocket', 'launch', 'startup', 'space', 'growth'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'shield-1',
    name: 'Shield',
    category: 'business',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 15 L 75 25 L 75 50 C 75 65 65 75 50 85 C 35 75 25 65 25 50 L 25 25 Z" fill="#10B981"/><path d="M 45 50 L 48 55 L 55 42" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['shield', 'security', 'protection', 'safe', 'verified'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'clock-1',
    name: 'Clock',
    category: 'business',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="#6366F1" stroke="#4F46E5" stroke-width="2"/><circle cx="50" cy="50" r="30" fill="#fff"/><line x1="50" y1="50" x2="50" y2="30" stroke="#1F2937" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="50" x2="65" y2="50" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="50" r="3" fill="#1F2937"/></svg>`,
    tags: ['clock', 'time', 'schedule', 'timer', 'hour'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'trophy-1',
    name: 'Trophy',
    category: 'sports',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 35 25 L 35 35 C 35 45 40 50 50 50 C 60 50 65 45 65 35 L 65 25 Z" fill="#FBBF24"/><rect x="30" y="20" width="40" height="8" rx="2" fill="#FBBF24"/><rect x="47" y="50" width="6" height="15" fill="#FBBF24"/><rect x="40" y="65" width="20" height="5" rx="2" fill="#FBBF24"/><path d="M 30 25 L 20 30 L 25 40 L 35 38" fill="#F59E0B"/><path d="M 70 25 L 80 30 L 75 40 L 65 38" fill="#F59E0B"/></svg>`,
    tags: ['trophy', 'award', 'winner', 'achievement', 'success'],
    source: 'Custom',
    color: '#FBBF24',
  },
  
  // NATURE
  {
    id: 'tree-1',
    name: 'Tree',
    category: 'nature',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="45" y="60" width="10" height="25" fill="#92400E"/><circle cx="50" cy="35" r="25" fill="#10B981"/><circle cx="35" cy="40" r="15" fill="#10B981"/><circle cx="65" cy="40" r="15" fill="#10B981"/></svg>`,
    tags: ['tree', 'nature', 'plant', 'forest', 'green'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'flower-1',
    name: 'Flower',
    category: 'nature',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="40" r="8" fill="#FBBF24"/><circle cx="50" cy="25" r="10" fill="#EC4899"/><circle cx="65" cy="35" r="10" fill="#EC4899"/><circle cx="60" cy="50" r="10" fill="#EC4899"/><circle cx="40" cy="50" r="10" fill="#EC4899"/><circle cx="35" cy="35" r="10" fill="#EC4899"/><rect x="48" y="50" width="4" height="35" fill="#10B981"/></svg>`,
    tags: ['flower', 'nature', 'plant', 'bloom', 'garden'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'sun-1',
    name: 'Sun',
    category: 'weather',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="20" fill="#FBBF24"/><line x1="50" y1="10" x2="50" y2="25" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="75" x2="50" y2="90" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/><line x1="10" y1="50" x2="25" y2="50" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/><line x1="75" y1="50" x2="90" y2="50" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/><line x1="20" y1="20" x2="30" y2="30" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/><line x1="70" y1="70" x2="80" y2="80" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/><line x1="80" y1="20" x2="70" y2="30" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/><line x1="30" y1="70" x2="20" y2="80" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/></svg>`,
    tags: ['sun', 'weather', 'sunny', 'bright', 'day'],
    source: 'Custom',
    color: '#FBBF24',
  },
  {
    id: 'cloud-1',
    name: 'Cloud',
    category: 'weather',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="25" ry="15" fill="#94A3B8"/><circle cx="35" cy="45" r="15" fill="#94A3B8"/><circle cx="65" cy="45" r="15" fill="#94A3B8"/></svg>`,
    tags: ['cloud', 'weather', 'cloudy', 'sky'],
    source: 'Custom',
    color: '#94A3B8',
  },
  
  // FOOD
  {
    id: 'pizza-1',
    name: 'Pizza',
    category: 'food',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 20 L 80 70 L 20 70 Z" fill="#F59E0B"/><circle cx="45" cy="50" r="4" fill="#EF4444"/><circle cx="60" cy="55" r="4" fill="#EF4444"/><circle cx="50" cy="60" r="4" fill="#EF4444"/></svg>`,
    tags: ['pizza', 'food', 'italian', 'meal', 'restaurant'],
    source: 'Custom',
    color: '#F59E0B',
  },
  {
    id: 'burger-1',
    name: 'Burger',
    category: 'food',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="30" rx="30" ry="10" fill="#F59E0B"/><rect x="20" y="35" width="60" height="8" fill="#10B981"/><rect x="20" y="43" width="60" height="10" fill="#92400E"/><rect x="20" y="53" width="60" height="8" fill="#FBBF24"/><ellipse cx="50" cy="65" rx="30" ry="10" fill="#F59E0B"/></svg>`,
    tags: ['burger', 'food', 'fast food', 'meal', 'restaurant'],
    source: 'Custom',
    color: '#F59E0B',
  },
  
  // ARROWS
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    category: 'arrows',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="50" x2="75" y2="50" stroke="#6366F1" stroke-width="4" stroke-linecap="round"/><polyline points="60,35 75,50 60,65" stroke="#6366F1" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['arrow', 'right', 'direction', 'next', 'forward'],
    source: 'Custom',
    color: '#6366F1',
  },
  {
    id: 'arrow-up',
    name: 'Arrow Up',
    category: 'arrows',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="50" y1="75" x2="50" y2="20" stroke="#10B981" stroke-width="4" stroke-linecap="round"/><polyline points="35,35 50,20 65,35" stroke="#10B981" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tags: ['arrow', 'up', 'direction', 'increase', 'growth'],
    source: 'Custom',
    color: '#10B981',
  },
  
  // SOCIAL
  {
    id: 'message-1',
    name: 'Message',
    category: 'social',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="25" width="60" height="45" rx="5" fill="#3B82F6"/><polygon points="35,70 50,80 65,70" fill="#3B82F6"/></svg>`,
    tags: ['message', 'chat', 'communication', 'social', 'talk'],
    source: 'Custom',
    color: '#3B82F6',
  },
  {
    id: 'thumbs-up',
    name: 'Thumbs Up',
    category: 'social',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 40 45 L 40 80 L 70 80 L 70 50 L 60 50 L 60 30 C 60 25 55 20 50 20 C 48 20 47 22 47 25 L 47 45 Z" fill="#3B82F6"/><rect x="25" y="50" width="15" height="30" rx="3" fill="#3B82F6"/></svg>`,
    tags: ['thumbs up', 'like', 'approve', 'social', 'good'],
    source: 'Custom',
    color: '#3B82F6',
  },
  
  // SPORTS
  {
    id: 'soccer-ball',
    name: 'Soccer Ball',
    category: 'sports',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="#fff" stroke="#000" stroke-width="2"/><polygon points="50,20 60,40 50,45 40,40" fill="#000"/><polygon points="30,35 40,40 35,55 20,50" fill="#000"/><polygon points="70,35 80,50 65,55 60,40" fill="#000"/><polygon points="35,65 50,70 50,85 35,80" fill="#000"/><polygon points="65,65 65,80 50,85 50,70" fill="#000"/></svg>`,
    tags: ['soccer', 'football', 'ball', 'sports', 'game'],
    source: 'Custom',
    color: '#000000',
  },
  
  // TRAVEL
  {
    id: 'airplane',
    name: 'Airplane',
    category: 'travel',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,20 55,45 75,50 55,55 50,80 45,55 25,50 45,45" fill="#3B82F6"/><rect x="48" y="15" width="4" height="10" fill="#3B82F6"/></svg>`,
    tags: ['airplane', 'plane', 'travel', 'flight', 'aviation'],
    source: 'Custom',
    color: '#3B82F6',
  },
  {
    id: 'map-pin',
    name: 'Map Pin',
    category: 'travel',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 20 C 35 20 25 30 25 45 C 25 60 50 85 50 85 C 50 85 75 60 75 45 C 75 30 65 20 50 20 Z" fill="#EF4444"/><circle cx="50" cy="45" r="10" fill="#fff"/></svg>`,
    tags: ['map', 'pin', 'location', 'place', 'travel'],
    source: 'Custom',
    color: '#EF4444',
  },
  
  // HOLIDAYS - Christmas
  {
    id: 'christmas-tree',
    name: 'Christmas Tree',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,15 35,35 40,35 25,55 30,55 15,75 85,75 70,55 75,55 60,35 65,35" fill="#10B981"/><rect x="45" y="75" width="10" height="15" fill="#92400E"/><circle cx="50" cy="25" r="3" fill="#EF4444"/><circle cx="40" cy="45" r="3" fill="#F59E0B"/><circle cx="60" cy="50" r="3" fill="#3B82F6"/><polygon points="50,10 52,15 48,15" fill="#FBBF24"/></svg>`,
    tags: ['christmas', 'tree', 'holiday', 'xmas', 'winter', 'festive'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'santa-hat',
    name: 'Santa Hat',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 30 60 Q 30 30 50 20 Q 70 30 70 60 Z" fill="#DC2626"/><ellipse cx="50" cy="60" rx="25" ry="8" fill="#fff"/><circle cx="50" cy="20" r="8" fill="#fff"/><path d="M 30 55 Q 30 35 50 25 Q 70 35 70 55" fill="#B91C1C"/></svg>`,
    tags: ['santa', 'hat', 'christmas', 'holiday', 'xmas'],
    source: 'Custom',
    color: '#DC2626',
  },
  {
    id: 'gift-box',
    name: 'Gift Box',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="45" width="50" height="40" fill="#EF4444"/><rect x="25" y="35" width="50" height="10" fill="#DC2626"/><rect x="47" y="35" width="6" height="50" fill="#FBBF24"/><rect x="25" y="52" width="50" height="6" fill="#FBBF24"/><path d="M 50 25 Q 40 25 40 35 L 50 35 Z" fill="#10B981"/><path d="M 50 25 Q 60 25 60 35 L 50 35 Z" fill="#10B981"/></svg>`,
    tags: ['gift', 'present', 'christmas', 'holiday', 'box'],
    source: 'Custom',
    color: '#EF4444',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="50" y1="15" x2="50" y2="85" stroke="#60A5FA" stroke-width="3"/><line x1="15" y1="50" x2="85" y2="50" stroke="#60A5FA" stroke-width="3"/><line x1="25" y1="25" x2="75" y2="75" stroke="#60A5FA" stroke-width="3"/><line x1="75" y1="25" x2="25" y2="75" stroke="#60A5FA" stroke-width="3"/><circle cx="50" cy="50" r="8" fill="#60A5FA"/><circle cx="50" cy="15" r="4" fill="#60A5FA"/><circle cx="50" cy="85" r="4" fill="#60A5FA"/><circle cx="15" cy="50" r="4" fill="#60A5FA"/><circle cx="85" cy="50" r="4" fill="#60A5FA"/><circle cx="25" cy="25" r="4" fill="#60A5FA"/><circle cx="75" cy="75" r="4" fill="#60A5FA"/><circle cx="75" cy="25" r="4" fill="#60A5FA"/><circle cx="25" cy="75" r="4" fill="#60A5FA"/></svg>`,
    tags: ['snowflake', 'snow', 'winter', 'christmas', 'cold'],
    source: 'Custom',
    color: '#60A5FA',
  },
  {
    id: 'candy-cane',
    name: 'Candy Cane',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 40 20 Q 60 20 60 40 L 60 80" stroke="#DC2626" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M 40 20 Q 60 20 60 40 L 60 80" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="8,8"/></svg>`,
    tags: ['candy', 'cane', 'christmas', 'sweet', 'peppermint'],
    source: 'Custom',
    color: '#DC2626',
  },
  
  // HOLIDAYS - Halloween
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="35" ry="30" fill="#F97316"/><path d="M 50 25 Q 55 20 60 25" stroke="#10B981" stroke-width="3" fill="none"/><polygon points="35,45 40,50 35,55" fill="#000"/><polygon points="65,45 60,50 65,55" fill="#000"/><path d="M 35 65 Q 50 70 65 65" stroke="#000" stroke-width="2" fill="none"/><line x1="50" y1="30" x2="50" y2="80" stroke="#D97706" stroke-width="2"/><line x1="35" y1="35" x2="35" y2="75" stroke="#D97706" stroke-width="2"/><line x1="65" y1="35" x2="65" y2="75" stroke="#D97706" stroke-width="2"/></svg>`,
    tags: ['pumpkin', 'halloween', 'fall', 'autumn', 'jack-o-lantern'],
    source: 'Custom',
    color: '#F97316',
  },
  {
    id: 'ghost',
    name: 'Ghost',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 30 40 Q 30 20 50 20 Q 70 20 70 40 L 70 75 Q 65 70 60 75 Q 55 70 50 75 Q 45 70 40 75 Q 35 70 30 75 Z" fill="#fff" stroke="#E5E7EB" stroke-width="2"/><circle cx="42" cy="40" r="4" fill="#000"/><circle cx="58" cy="40" r="4" fill="#000"/><path d="M 45 50 Q 50 52 55 50" stroke="#000" stroke-width="2" fill="none"/></svg>`,
    tags: ['ghost', 'halloween', 'spooky', 'boo', 'spirit'],
    source: 'Custom',
    color: '#FFFFFF',
  },
  {
    id: 'witch-hat',
    name: 'Witch Hat',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,20 35,60 65,60" fill="#7C3AED"/><ellipse cx="50" cy="60" rx="30" ry="8" fill="#7C3AED"/><rect x="30" y="58" width="40" height="6" fill="#F59E0B"/></svg>`,
    tags: ['witch', 'hat', 'halloween', 'magic', 'spooky'],
    source: 'Custom',
    color: '#7C3AED',
  },
  {
    id: 'bat',
    name: 'Bat',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="10" ry="12" fill="#1F2937"/><path d="M 40 45 Q 25 35 15 45 Q 20 55 30 50 Z" fill="#1F2937"/><path d="M 60 45 Q 75 35 85 45 Q 80 55 70 50 Z" fill="#1F2937"/><circle cx="47" cy="47" r="2" fill="#EF4444"/><circle cx="53" cy="47" r="2" fill="#EF4444"/></svg>`,
    tags: ['bat', 'halloween', 'spooky', 'night', 'vampire'],
    source: 'Custom',
    color: '#1F2937',
  },
  
  // HOLIDAYS - Easter
  {
    id: 'easter-egg',
    name: 'Easter Egg',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="25" ry="35" fill="#EC4899"/><path d="M 25 45 Q 50 40 75 45" stroke="#fff" stroke-width="3" fill="none"/><path d="M 25 60 Q 50 55 75 60" stroke="#fff" stroke-width="3" fill="none"/><circle cx="35" cy="35" r="3" fill="#FBBF24"/><circle cx="50" cy="70" r="3" fill="#FBBF24"/><circle cx="65" cy="50" r="3" fill="#FBBF24"/></svg>`,
    tags: ['easter', 'egg', 'spring', 'holiday', 'bunny'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'bunny',
    name: 'Easter Bunny',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="60" rx="20" ry="25" fill="#F3F4F6"/><circle cx="50" cy="45" r="15" fill="#F3F4F6"/><ellipse cx="40" cy="25" rx="6" ry="15" fill="#F3F4F6"/><ellipse cx="60" cy="25" rx="6" ry="15" fill="#F3F4F6"/><ellipse cx="42" cy="28" rx="3" ry="8" fill="#FCA5A5"/><ellipse cx="58" cy="28" rx="3" ry="8" fill="#FCA5A5"/><circle cx="45" cy="43" r="2" fill="#000"/><circle cx="55" cy="43" r="2" fill="#000"/><circle cx="50" cy="48" r="2" fill="#EC4899"/></svg>`,
    tags: ['bunny', 'rabbit', 'easter', 'spring', 'cute'],
    source: 'Custom',
    color: '#F3F4F6',
  },
  
  // HOLIDAYS - Valentine's Day
  {
    id: 'heart',
    name: 'Heart',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 80 Q 20 60 20 40 Q 20 25 30 20 Q 40 15 50 25 Q 60 15 70 20 Q 80 25 80 40 Q 80 60 50 80 Z" fill="#EF4444"/></svg>`,
    tags: ['heart', 'love', 'valentine', 'romance', 'valentines day'],
    source: 'Custom',
    color: '#EF4444',
  },
  {
    id: 'cupid-arrow',
    name: 'Cupid Arrow',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="50" x2="80" y2="50" stroke="#DC2626" stroke-width="3"/><polygon points="80,50 70,45 70,55" fill="#DC2626"/><path d="M 15 45 L 20 50 L 15 55 Z" fill="#EC4899"/><path d="M 50 30 Q 55 45 50 50 Q 45 45 50 30 Z" fill="#EF4444"/></svg>`,
    tags: ['arrow', 'cupid', 'love', 'valentine', 'romance'],
    source: 'Custom',
    color: '#DC2626',
  },
  {
    id: 'rose',
    name: 'Rose',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="35" rx="15" ry="12" fill="#EF4444"/><ellipse cx="40" cy="35" rx="10" ry="8" fill="#DC2626"/><ellipse cx="60" cy="35" rx="10" ry="8" fill="#DC2626"/><line x1="50" y1="45" x2="50" y2="75" stroke="#10B981" stroke-width="3"/><path d="M 50 55 Q 40 55 35 60" stroke="#10B981" stroke-width="2" fill="none"/><path d="M 50 65 Q 60 65 65 70" stroke="#10B981" stroke-width="2" fill="none"/></svg>`,
    tags: ['rose', 'flower', 'valentine', 'love', 'romance'],
    source: 'Custom',
    color: '#EF4444',
  },
  
  // HOLIDAYS - St. Patrick's Day
  {
    id: 'shamrock',
    name: 'Shamrock',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="12" fill="#10B981"/><circle cx="60" cy="40" r="12" fill="#10B981"/><circle cx="50" cy="55" r="12" fill="#10B981"/><line x1="50" y1="60" x2="50" y2="80" stroke="#059669" stroke-width="3"/></svg>`,
    tags: ['shamrock', 'clover', 'st patricks day', 'irish', 'luck'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'pot-of-gold',
    name: 'Pot of Gold',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="65" rx="25" ry="15" fill="#1F2937"/><rect x="25" y="50" width="50" height="15" fill="#374151"/><circle cx="40" cy="45" r="6" fill="#FBBF24"/><circle cx="50" cy="42" r="6" fill="#FBBF24"/><circle cx="60" cy="45" r="6" fill="#FBBF24"/><circle cx="45" cy="50" r="5" fill="#F59E0B"/><circle cx="55" cy="50" r="5" fill="#F59E0B"/></svg>`,
    tags: ['pot', 'gold', 'st patricks day', 'irish', 'rainbow', 'luck'],
    source: 'Custom',
    color: '#FBBF24',
  },
  
  // HOLIDAYS - Independence Day / 4th of July
  {
    id: 'firework',
    name: 'Firework',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="8" fill="#EF4444"/><line x1="50" y1="50" x2="50" y2="25" stroke="#FBBF24" stroke-width="3"/><line x1="50" y1="50" x2="75" y2="50" stroke="#3B82F6" stroke-width="3"/><line x1="50" y1="50" x2="50" y2="75" stroke="#EF4444" stroke-width="3"/><line x1="50" y1="50" x2="25" y2="50" stroke="#FBBF24" stroke-width="3"/><line x1="50" y1="50" x2="68" y2="32" stroke="#3B82F6" stroke-width="3"/><line x1="50" y1="50" x2="68" y2="68" stroke="#EF4444" stroke-width="3"/><line x1="50" y1="50" x2="32" y2="68" stroke="#FBBF24" stroke-width="3"/><line x1="50" y1="50" x2="32" y2="32" stroke="#3B82F6" stroke-width="3"/><circle cx="50" cy="25" r="3" fill="#FBBF24"/><circle cx="75" cy="50" r="3" fill="#3B82F6"/><circle cx="50" cy="75" r="3" fill="#EF4444"/><circle cx="25" cy="50" r="3" fill="#FBBF24"/></svg>`,
    tags: ['firework', 'fireworks', '4th of july', 'independence day', 'celebration'],
    source: 'Custom',
    color: '#EF4444',
  },
  {
    id: 'american-flag',
    name: 'American Flag',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="25" width="60" height="50" fill="#DC2626"/><rect x="20" y="25" width="60" height="7" fill="#fff"/><rect x="20" y="39" width="60" height="7" fill="#fff"/><rect x="20" y="53" width="60" height="7" fill="#fff"/><rect x="20" y="67" width="60" height="8" fill="#fff"/><rect x="20" y="25" width="25" height="25" fill="#1E40AF"/><circle cx="27" cy="32" r="1.5" fill="#fff"/><circle cx="33" cy="32" r="1.5" fill="#fff"/><circle cx="39" cy="32" r="1.5" fill="#fff"/><circle cx="27" cy="38" r="1.5" fill="#fff"/><circle cx="33" cy="38" r="1.5" fill="#fff"/><circle cx="39" cy="38" r="1.5" fill="#fff"/><circle cx="27" cy="44" r="1.5" fill="#fff"/><circle cx="33" cy="44" r="1.5" fill="#fff"/><circle cx="39" cy="44" r="1.5" fill="#fff"/></svg>`,
    tags: ['flag', 'american', 'usa', '4th of july', 'independence day', 'patriotic'],
    source: 'Custom',
    color: '#DC2626',
  },
  
  // HOLIDAYS - Thanksgiving
  {
    id: 'turkey',
    name: 'Turkey',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="18" ry="22" fill="#92400E"/><circle cx="50" cy="40" r="12" fill="#78350F"/><ellipse cx="35" cy="50" rx="8" ry="20" fill="#DC2626" transform="rotate(-20 35 50)"/><ellipse cx="40" cy="48" rx="8" ry="20" fill="#F59E0B" transform="rotate(-10 40 48)"/><ellipse cx="60" cy="48" rx="8" ry="20" fill="#F59E0B" transform="rotate(10 60 48)"/><ellipse cx="65" cy="50" rx="8" ry="20" fill="#DC2626" transform="rotate(20 65 50)"/><circle cx="45" cy="38" r="2" fill="#000"/><circle cx="55" cy="38" r="2" fill="#000"/><path d="M 48 43 L 50 46 L 52 43" stroke="#F59E0B" stroke-width="2" fill="none"/></svg>`,
    tags: ['turkey', 'thanksgiving', 'fall', 'autumn', 'holiday'],
    source: 'Custom',
    color: '#92400E',
  },
  {
    id: 'autumn-leaf',
    name: 'Autumn Leaf',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 20 Q 65 30 70 45 Q 72 60 65 70 Q 55 78 50 80 Q 45 78 35 70 Q 28 60 30 45 Q 35 30 50 20 Z" fill="#F59E0B"/><line x1="50" y1="25" x2="50" y2="80" stroke="#92400E" stroke-width="2"/><path d="M 50 35 Q 55 40 58 45" stroke="#92400E" stroke-width="1.5" fill="none"/><path d="M 50 50 Q 45 55 42 60" stroke="#92400E" stroke-width="1.5" fill="none"/></svg>`,
    tags: ['leaf', 'autumn', 'fall', 'thanksgiving', 'nature'],
    source: 'Custom',
    color: '#F59E0B',
  },
  
  // HOLIDAYS - New Year
  {
    id: 'champagne',
    name: 'Champagne',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 40 45 L 35 80 L 65 80 L 60 45 Z" fill="#10B981"/><ellipse cx="50" cy="45" rx="10" ry="5" fill="#059669"/><rect x="35" y="78" width="30" height="5" fill="#059669"/><path d="M 50 25 Q 45 30 45 35 L 55 35 Q 55 30 50 25 Z" fill="#374151"/><circle cx="45" cy="20" r="2" fill="#FBBF24"/><circle cx="52" cy="18" r="2" fill="#FBBF24"/><circle cx="48" cy="15" r="2" fill="#FBBF24"/></svg>`,
    tags: ['champagne', 'new year', 'celebration', 'party', 'drink'],
    source: 'Custom',
    color: '#10B981',
  },
  {
    id: 'party-hat',
    name: 'Party Hat',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,20 30,65 70,65" fill="#EC4899"/><ellipse cx="50" cy="65" rx="20" ry="6" fill="#DB2777"/><circle cx="50" cy="20" r="5" fill="#FBBF24"/><line x1="35" y1="35" x2="65" y2="35" stroke="#fff" stroke-width="2"/><line x1="32" y1="50" x2="68" y2="50" stroke="#fff" stroke-width="2"/></svg>`,
    tags: ['party', 'hat', 'celebration', 'new year', 'birthday'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'confetti',
    name: 'Confetti',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="30" width="8" height="8" fill="#EF4444" transform="rotate(15 29 34)"/><rect x="55" y="25" width="8" height="8" fill="#3B82F6" transform="rotate(-20 59 29)"/><rect x="70" y="45" width="8" height="8" fill="#FBBF24" transform="rotate(30 74 49)"/><rect x="35" y="55" width="8" height="8" fill="#10B981" transform="rotate(-15 39 59)"/><rect x="60" y="65" width="8" height="8" fill="#EC4899" transform="rotate(25 64 69)"/><circle cx="45" cy="40" r="4" fill="#8B5CF6"/><circle cx="30" cy="70" r="4" fill="#F59E0B"/><circle cx="75" cy="30" r="4" fill="#EF4444"/></svg>`,
    tags: ['confetti', 'celebration', 'party', 'new year', 'festive'],
    source: 'Custom',
    color: '#EC4899',
  },
  
  // HOLIDAYS - Birthday
  {
    id: 'birthday-cake',
    name: 'Birthday Cake',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="50" width="40" height="25" fill="#EC4899"/><rect x="25" y="45" width="50" height="5" fill="#DB2777"/><rect x="28" y="52" width="44" height="3" fill="#fff"/><rect x="35" y="75" width="30" height="10" fill="#F59E0B"/><rect x="30" y="70" width="40" height="5" fill="#EF4444"/><line x1="45" y1="35" x2="45" y2="45" stroke="#FBBF24" stroke-width="2"/><line x1="55" y1="35" x2="55" y2="45" stroke="#FBBF24" stroke-width="2"/><ellipse cx="45" cy="33" rx="2" ry="4" fill="#F59E0B"/><ellipse cx="55" cy="33" rx="2" ry="4" fill="#F59E0B"/></svg>`,
    tags: ['cake', 'birthday', 'celebration', 'party', 'dessert'],
    source: 'Custom',
    color: '#EC4899',
  },
  {
    id: 'balloon',
    name: 'Balloon',
    category: 'holidays',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="40" rx="20" ry="25" fill="#EF4444"/><path d="M 50 65 Q 48 70 50 75 L 50 85" stroke="#DC2626" stroke-width="2" fill="none"/><ellipse cx="48" cy="30" rx="6" ry="8" fill="#FCA5A5" opacity="0.5"/></svg>`,
    tags: ['balloon', 'party', 'birthday', 'celebration', 'festive'],
    source: 'Custom',
    color: '#EF4444',
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
