export interface Icon {
  id: string;
  name: string;
  category: string;
  svgPath: string;
  keywords?: string[];
}

export const ICON_CATEGORIES = {
  'all': 'All Icons',
  'arrows': 'Arrows',
  'ui': 'UI Elements',
  'social': 'Social Media',
  'business': 'Business',
  'media': 'Media',
  'files': 'Files',
  'communication': 'Communication',
  'ecommerce': 'E-commerce',
  'shapes': 'Shapes',
  'decorative': 'Decorative',
} as const;

export const ICON_LIBRARY: Icon[] = [
  // Arrows
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    category: 'arrows',
    svgPath: 'M5 12h14M12 5l7 7-7 7',
    keywords: ['arrow', 'right', 'next', 'forward', 'direction'],
  },
  {
    id: 'arrow-left',
    name: 'Arrow Left',
    category: 'arrows',
    svgPath: 'M19 12H5M12 19l-7-7 7-7',
    keywords: ['arrow', 'left', 'back', 'previous', 'direction'],
  },
  {
    id: 'arrow-up',
    name: 'Arrow Up',
    category: 'arrows',
    svgPath: 'M12 19V5M5 12l7-7 7 7',
    keywords: ['arrow', 'up', 'top', 'direction'],
  },
  {
    id: 'arrow-down',
    name: 'Arrow Down',
    category: 'arrows',
    svgPath: 'M12 5v14M19 12l-7 7-7-7',
    keywords: ['arrow', 'down', 'bottom', 'direction'],
  },
  {
    id: 'chevron-right',
    name: 'Chevron Right',
    category: 'arrows',
    svgPath: 'M9 18l6-6-6-6',
    keywords: ['chevron', 'right', 'next'],
  },
  {
    id: 'chevron-left',
    name: 'Chevron Left',
    category: 'arrows',
    svgPath: 'M15 18l-6-6 6-6',
    keywords: ['chevron', 'left', 'back'],
  },
  {
    id: 'chevron-up',
    name: 'Chevron Up',
    category: 'arrows',
    svgPath: 'M18 15l-6-6-6 6',
    keywords: ['chevron', 'up', 'top'],
  },
  {
    id: 'chevron-down',
    name: 'Chevron Down',
    category: 'arrows',
    svgPath: 'M6 9l6 6 6-6',
    keywords: ['chevron', 'down', 'bottom'],
  },
  
  // UI Elements
  {
    id: 'check',
    name: 'Check',
    category: 'ui',
    svgPath: 'M20 6L9 17l-5-5',
    keywords: ['check', 'tick', 'done', 'complete', 'success'],
  },
  {
    id: 'x',
    name: 'X',
    category: 'ui',
    svgPath: 'M18 6L6 18M6 6l12 12',
    keywords: ['x', 'close', 'cancel', 'delete', 'remove'],
  },
  {
    id: 'plus',
    name: 'Plus',
    category: 'ui',
    svgPath: 'M12 5v14M5 12h14',
    keywords: ['plus', 'add', 'new', 'create'],
  },
  {
    id: 'minus',
    name: 'Minus',
    category: 'ui',
    svgPath: 'M5 12h14',
    keywords: ['minus', 'remove', 'subtract', 'delete'],
  },
  {
    id: 'menu',
    name: 'Menu',
    category: 'ui',
    svgPath: 'M4 6h16M4 12h16M4 18h16',
    keywords: ['menu', 'hamburger', 'navigation', 'list'],
  },
  {
    id: 'settings',
    name: 'Settings',
    category: 'ui',
    svgPath: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    keywords: ['settings', 'gear', 'cog', 'preferences', 'config'],
  },
  {
    id: 'search',
    name: 'Search',
    category: 'ui',
    svgPath: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
    keywords: ['search', 'find', 'magnify', 'lookup'],
  },
  {
    id: 'home',
    name: 'Home',
    category: 'ui',
    svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6',
    keywords: ['home', 'house', 'main', 'dashboard'],
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'ui',
    svgPath: 'M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zM14 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6zM4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2zM14 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z',
    keywords: ['grid', 'layout', 'squares', 'boxes'],
  },
  {
    id: 'list',
    name: 'List',
    category: 'ui',
    svgPath: 'M4 6h16M4 12h16M4 18h16',
    keywords: ['list', 'menu', 'lines', 'items'],
  },
  {
    id: 'eye',
    name: 'Eye',
    category: 'ui',
    svgPath: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    keywords: ['eye', 'view', 'see', 'visible', 'watch'],
  },
  {
    id: 'lock',
    name: 'Lock',
    category: 'ui',
    svgPath: 'M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z',
    keywords: ['lock', 'secure', 'private', 'protected', 'password'],
  },
  {
    id: 'bell',
    name: 'Bell',
    category: 'ui',
    svgPath: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9',
    keywords: ['bell', 'notification', 'alert', 'ring'],
  },
  {
    id: 'star',
    name: 'Star',
    category: 'ui',
    svgPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z',
    keywords: ['star', 'favorite', 'rating', 'bookmark'],
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'ui',
    svgPath: 'M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z',
    keywords: ['heart', 'like', 'love', 'favorite'],
  },
  
  // Social Media
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    svgPath: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    keywords: ['facebook', 'social', 'media'],
  },
  {
    id: 'twitter',
    name: 'Twitter',
    category: 'social',
    svgPath: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
    keywords: ['twitter', 'x', 'social', 'media', 'tweet'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    svgPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    keywords: ['instagram', 'social', 'media', 'photo'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    svgPath: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    keywords: ['linkedin', 'social', 'media', 'professional'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    svgPath: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.98l5.75 3.02-5.75 3.02z',
    keywords: ['youtube', 'video', 'social', 'media'],
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'social',
    svgPath: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
    keywords: ['github', 'code', 'social', 'developer'],
  },
  {
    id: 'mail',
    name: 'Mail',
    category: 'social',
    svgPath: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
    keywords: ['mail', 'email', 'message', 'contact'],
  },
  {
    id: 'phone',
    name: 'Phone',
    category: 'social',
    svgPath: 'M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z',
    keywords: ['phone', 'call', 'contact', 'telephone'],
  },
  
  // Business
  {
    id: 'briefcase',
    name: 'Briefcase',
    category: 'business',
    svgPath: 'M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
    keywords: ['briefcase', 'business', 'work', 'job'],
  },
  {
    id: 'building',
    name: 'Building',
    category: 'business',
    svgPath: 'M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4',
    keywords: ['building', 'office', 'company', 'business'],
  },
  {
    id: 'users',
    name: 'Users',
    category: 'business',
    svgPath: 'M12 4.354a4 4 0 1 1 0 5.292M15 21H3v-1a6 6 0 0 1 12 0v1zm0 0h6v-1a6 6 0 0 0-9-5.197M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
    keywords: ['users', 'people', 'team', 'group'],
  },
  {
    id: 'user',
    name: 'User',
    category: 'business',
    svgPath: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z',
    keywords: ['user', 'person', 'profile', 'account'],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'business',
    svgPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
    keywords: ['calendar', 'date', 'schedule', 'event'],
  },
  {
    id: 'clock',
    name: 'Clock',
    category: 'business',
    svgPath: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    keywords: ['clock', 'time', 'watch', 'schedule'],
  },
  {
    id: 'dollar-sign',
    name: 'Dollar Sign',
    category: 'business',
    svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    keywords: ['dollar', 'money', 'price', 'currency'],
  },
  {
    id: 'credit-card',
    name: 'Credit Card',
    category: 'business',
    svgPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z',
    keywords: ['credit', 'card', 'payment', 'money'],
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    category: 'business',
    svgPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
    keywords: ['cart', 'shopping', 'buy', 'purchase'],
  },
  {
    id: 'trending-up',
    name: 'Trending Up',
    category: 'business',
    svgPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    keywords: ['trending', 'up', 'growth', 'increase', 'chart'],
  },
  
  // Media
  {
    id: 'image',
    name: 'Image',
    category: 'media',
    svgPath: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
    keywords: ['image', 'photo', 'picture', 'gallery'],
  },
  {
    id: 'film',
    name: 'Film',
    category: 'media',
    svgPath: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1z',
    keywords: ['film', 'video', 'movie', 'cinema'],
  },
  {
    id: 'music',
    name: 'Music',
    category: 'media',
    svgPath: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    keywords: ['music', 'audio', 'sound', 'song'],
  },
  {
    id: 'camera',
    name: 'Camera',
    category: 'media',
    svgPath: 'M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    keywords: ['camera', 'photo', 'picture', 'photography'],
  },
  {
    id: 'play',
    name: 'Play',
    category: 'media',
    svgPath: 'M14.752 11.168l-3.197-2.132A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664zM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    keywords: ['play', 'video', 'media', 'start'],
  },
  {
    id: 'pause',
    name: 'Pause',
    category: 'media',
    svgPath: 'M10 9v6m4-6v6m7-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    keywords: ['pause', 'stop', 'media', 'video'],
  },
  {
    id: 'volume',
    name: 'Volume',
    category: 'media',
    svgPath: 'M15.536 8.464a5 5 0 0 1 0 7.072m2.828-9.9a9 9 0 0 1 0 12.728M5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
    keywords: ['volume', 'sound', 'audio', 'speaker'],
  },
  {
    id: 'download',
    name: 'Download',
    category: 'media',
    svgPath: 'M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    keywords: ['download', 'save', 'get', 'file'],
  },
  {
    id: 'upload',
    name: 'Upload',
    category: 'media',
    svgPath: 'M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    keywords: ['upload', 'send', 'share', 'file'],
  },
  
  // Files
  {
    id: 'file',
    name: 'File',
    category: 'files',
    svgPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z',
    keywords: ['file', 'document', 'page'],
  },
  {
    id: 'file-text',
    name: 'File Text',
    category: 'files',
    svgPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z',
    keywords: ['file', 'text', 'document', 'page'],
  },
  {
    id: 'folder',
    name: 'Folder',
    category: 'files',
    svgPath: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z',
    keywords: ['folder', 'directory', 'organize'],
  },
  {
    id: 'save',
    name: 'Save',
    category: 'files',
    svgPath: 'M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
    keywords: ['save', 'store', 'keep'],
  },
  {
    id: 'copy',
    name: 'Copy',
    category: 'files',
    svgPath: 'M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z',
    keywords: ['copy', 'duplicate', 'clone'],
  },
  {
    id: 'trash',
    name: 'Trash',
    category: 'files',
    svgPath: 'M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16',
    keywords: ['trash', 'delete', 'remove', 'bin'],
  },
  {
    id: 'edit',
    name: 'Edit',
    category: 'files',
    svgPath: 'M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    keywords: ['edit', 'pencil', 'modify', 'change'],
  },
  {
    id: 'pen',
    name: 'Pen',
    category: 'files',
    svgPath: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    keywords: ['pen', 'write', 'draw', 'edit'],
  },
  
  // Communication
  {
    id: 'send',
    name: 'Send',
    category: 'communication',
    svgPath: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
    keywords: ['send', 'message', 'mail', 'email'],
  },
  {
    id: 'inbox',
    name: 'Inbox',
    category: 'communication',
    svgPath: 'M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4',
    keywords: ['inbox', 'mail', 'messages', 'email'],
  },
  {
    id: 'message-circle',
    name: 'Message Circle',
    category: 'communication',
    svgPath: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
    keywords: ['message', 'chat', 'comment', 'talk'],
  },
  {
    id: 'video',
    name: 'Video',
    category: 'communication',
    svgPath: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z',
    keywords: ['video', 'call', 'camera', 'meeting'],
  },
  {
    id: 'at-sign',
    name: 'At Sign',
    category: 'communication',
    svgPath: 'M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-9 9m4.5-1.206a8.959 8.959 0 0 1-4.5 1.207',
    keywords: ['at', 'email', 'mention', 'tag'],
  },
  
  // E-commerce
  {
    id: 'shopping-bag',
    name: 'Shopping Bag',
    category: 'ecommerce',
    svgPath: 'M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z',
    keywords: ['bag', 'shopping', 'store', 'buy'],
  },
  {
    id: 'tag',
    name: 'Tag',
    category: 'ecommerce',
    svgPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z',
    keywords: ['tag', 'label', 'price', 'sale'],
  },
  {
    id: 'gift',
    name: 'Gift',
    category: 'ecommerce',
    svgPath: 'M12 8v13m0-13V6a2 2 0 1 1 2 2h-2zm0 0V5.5A2.5 2.5 0 1 0 9.5 8H12zm-7 4h14M5 12a2 2 0 1 1 0 4h14a2 2 0 1 1 0-4M5 12v7.5a1.5 1.5 0 0 0 3 0V12m11 0v7.5a1.5 1.5 0 0 1-3 0V12',
    keywords: ['gift', 'present', 'box', 'give'],
  },
  {
    id: 'package',
    name: 'Package',
    category: 'ecommerce',
    svgPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    keywords: ['package', 'box', 'delivery', 'shipping'],
  },
  {
    id: 'store',
    name: 'Store',
    category: 'ecommerce',
    svgPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
    keywords: ['store', 'shop', 'retail', 'market'],
  },
  
  // Shapes
  {
    id: 'circle',
    name: 'Circle',
    category: 'shapes',
    svgPath: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    keywords: ['circle', 'round', 'shape'],
  },
  {
    id: 'square',
    name: 'Square',
    category: 'shapes',
    svgPath: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    keywords: ['square', 'box', 'shape'],
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'shapes',
    svgPath: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    keywords: ['triangle', 'shape'],
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'shapes',
    svgPath: 'M17 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4z',
    keywords: ['hexagon', 'shape'],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'shapes',
    svgPath: 'M6 3h12l4 6-10 12L2 9l4-6z',
    keywords: ['diamond', 'shape'],
  },
  
  // Decorative
  {
    id: 'sparkles',
    name: 'Sparkles',
    category: 'decorative',
    svgPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    keywords: ['sparkles', 'stars', 'decorative', 'magic'],
  },
  {
    id: 'zap',
    name: 'Zap',
    category: 'decorative',
    svgPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    keywords: ['zap', 'lightning', 'energy', 'power'],
  },
  {
    id: 'sun',
    name: 'Sun',
    category: 'decorative',
    svgPath: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
    keywords: ['sun', 'light', 'day', 'bright'],
  },
  {
    id: 'moon',
    name: 'Moon',
    category: 'decorative',
    svgPath: 'M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z',
    keywords: ['moon', 'night', 'dark', 'crescent'],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'decorative',
    svgPath: 'M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 1 0-9.78 2.096A4.001 4.001 0 0 0 3 15z',
    keywords: ['cloud', 'weather', 'sky'],
  },
  {
    id: 'flower',
    name: 'Flower',
    category: 'decorative',
    svgPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z',
    keywords: ['flower', 'nature', 'plant', 'decorative'],
  },
];

// Get icons by category
export function getIconsByCategory(category: string): Icon[] {
  if (category === 'all') {
    return ICON_LIBRARY;
  }
  return ICON_LIBRARY.filter(icon => icon.category === category);
}

// Search icons
export function searchIcons(query: string, category?: string): Icon[] {
  const lowerQuery = query.toLowerCase();
  let icons = category && category !== 'all' 
    ? getIconsByCategory(category)
    : ICON_LIBRARY;
  
  return icons.filter(icon => 
    icon.name.toLowerCase().includes(lowerQuery) ||
    icon.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery))
  );
}

// Get icon SVG data URL
export function getIconSVGDataURL(icon: Icon, size: number = 24, color: string = '#000000'): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="${icon.svgPath}"/>
    </svg>
  `;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}



