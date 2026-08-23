/**
 * SINGLE SOURCE OF TRUTH - DO NOT DUPLICATE
 * All navigation items must be defined here and only here
 */
export const NAV_ITEMS = [
  // DETECTION Section
  { 
    id: 'dashboard',
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: 'LayoutDashboard',
    section: 'DETECTION'
  },
  { 
    id: 'analyze',
    label: 'Analyze Email', 
    href: '/analyze', 
    icon: 'Mail',
    section: 'DETECTION'
  },
  { 
    id: 'history',
    label: 'History', 
    href: '/history', 
    icon: 'Clock',
    section: 'DETECTION'
  },
  
  // INTELLIGENCE Section
  { 
    id: 'reports',
    label: 'Reports', 
    href: '/reports', 
    icon: 'BarChart3',
    section: 'INTELLIGENCE'
  },
  { 
    id: 'cases',
    label: 'Cases', 
    href: '/cases', 
    icon: 'Folder',
    section: 'INTELLIGENCE'
  },
  { 
    id: 'chat',
    label: 'AI Chat', 
    href: '/chat', 
    icon: 'MessageCircle',
    section: 'INTELLIGENCE'
  },
  
  // SYSTEM Section - INCLUDES ABOUT
  { 
    id: 'settings',
    label: 'Settings', 
    href: '/settings', 
    icon: 'Settings',
    section: 'SYSTEM'
  },
  { 
    id: 'about',  // ← THIS MUST ALWAYS BE HERE
    label: 'About', 
    href: '/about', 
    icon: 'Info',
    section: 'SYSTEM'
  },
] as const;

export type NavItem = typeof NAV_ITEMS[number];
