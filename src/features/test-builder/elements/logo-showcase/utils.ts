export const uid = (prefix = '') => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Simple client-side upload helper that hits your upload endpoint.
 * Replace /api/upload with your own presigned flow or S3 upload.
 */
export async function uploadFile(file: File): Promise<{ url: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!r.ok) throw new Error('Upload failed');
  return r.json();
}

// Helper function to create inline SVG logo placeholders (fallback)
export const createLogoSVG = (color: string, text: string): string => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
      <rect width="200" height="80" fill="${color}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
        ${text}
      </text>
    </svg>
  `)}`;
};

// Create professional-looking logo SVGs with modern designs
const createProfessionalLogo = (id: number): string => {
  const designs = [
    // Design 1: Modern lettermark "A"
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      <rect width="120" height="40" fill="white"/>
      <path d="M20 30 L25 10 L30 30 M22 22 L28 22" stroke="#3B82F6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="40" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1F2937">ACME</text>
    </svg>`,
    // Design 2: Circle with letter
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      <rect width="120" height="40" fill="white"/>
      <circle cx="20" cy="20" r="12" fill="#8B5CF6"/>
      <text x="20" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="white" text-anchor="middle">B</text>
      <text x="40" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1F2937">BRAND</text>
    </svg>`,
    // Design 3: Abstract shape
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      <rect width="120" height="40" fill="white"/>
      <path d="M15 10 L25 10 L20 20 L25 30 L15 30 Z" fill="#10B981"/>
      <text x="35" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1F2937">COMPANY</text>
    </svg>`,
    // Design 4: Geometric
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      <rect width="120" height="40" fill="white"/>
      <rect x="12" y="12" width="16" height="16" fill="#F59E0B" rx="2"/>
      <text x="35" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1F2937">PARTNER</text>
    </svg>`,
    // Design 5: Wave design
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      <rect width="120" height="40" fill="white"/>
      <path d="M10 20 Q15 10, 20 20 T30 20" stroke="#EF4444" stroke-width="3" fill="none"/>
      <text x="40" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1F2937">CLIENT</text>
    </svg>`,
    // Design 6: Star shape
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
      <rect width="120" height="40" fill="white"/>
      <path d="M20 10 L22 18 L30 18 L24 23 L26 30 L20 25 L14 30 L16 23 L10 18 L18 18 Z" fill="#6366F1"/>
      <text x="40" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1F2937">SPONSOR</text>
    </svg>`
  ];
  
  const svg = designs[id % designs.length];
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Sample logos for initial state with embedded professional SVG designs
export const sampleLogos = [
  {
    id: uid('logo-'),
    src: createProfessionalLogo(0),
    alt: 'Partner Logo 1',
    visible: true,
    opacity: 1
  },
  {
    id: uid('logo-'),
    src: createProfessionalLogo(1),
    alt: 'Partner Logo 2',
    visible: true,
    opacity: 1
  },
  {
    id: uid('logo-'),
    src: createProfessionalLogo(2),
    alt: 'Partner Logo 3',
    visible: true,
    opacity: 1
  },
  {
    id: uid('logo-'),
    src: createProfessionalLogo(3),
    alt: 'Partner Logo 4',
    visible: true,
    opacity: 1
  },
  {
    id: uid('logo-'),
    src: createProfessionalLogo(4),
    alt: 'Partner Logo 5',
    visible: true,
    opacity: 1
  },
  {
    id: uid('logo-'),
    src: createProfessionalLogo(5),
    alt: 'Partner Logo 6',
    visible: true,
    opacity: 1
  }
];

// Export for use in settings
export { createProfessionalLogo };
