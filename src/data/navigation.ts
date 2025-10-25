
export const NAV_LINKS = [
  { 
    label: 'Home', 
    href: '/' 
  },
  { 
    label: 'Venues', 
    href: '/venues' 
  },
  { 
    label: 'Vendors', 
    href: '/vendors' 
  },
  { 
    label: 'Explore',
    href: '/explore',
    highlight: true
  },
  { 
    label: 'Community',
    href: '/community'
  },
  { 
    label: 'Planning', 
    href: '/planning',
    children: [
      { label: 'Checklist', href: '/tools/checklist' },
      { label: 'Budget', href: '/tools/budget' },
      { label: 'Guest List', href: '/tools/guests' },
      { label: 'Timeline', href: '/tools/timeline' },
    ]
  },
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Favorites',
    href: '/favorites'
  },
  { 
    label: 'About', 
    href: '/about' 
  },
  { 
    label: 'Contact', 
    href: '/contact' 
  },
];

export const MOBILE_NAV_LINKS = [
  ...NAV_LINKS,
  { label: 'Login', href: '/auth/login' },
  { label: 'Sign Up', href: '/auth/signup' },
];
