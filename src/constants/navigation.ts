/**
 * Single source of truth for navigation items
 * This ensures consistent rendering across all components
 */
export const NAV_ITEMS = [
  { 
    id: 'dashboard',
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: 'LayoutDashboard',
    description: 'Overview dashboard'
  },
  { 
    id: 'analyze',
    label: 'Analyze Email', 
    href: '/analyze', 
    icon: 'Mail',
    description: 'Email analysis tool'
  },
  { 
    id: 'history',
    label: 'History', 
    href: '/history', 
    icon: 'Clock',
    description: 'Analysis history'
  },
  { 
    id: 'reports',
    label: 'Reports', 
    href: '/reports', 
    icon: 'BarChart3',
    description: 'Generated reports'
  },
  { 
    id: 'cases',
    label: 'Cases', 
    href: '/cases', 
    icon: 'Folder',
    description: 'Case management'
  },
  { 
    id: 'chat',
    label: 'AI Chat', 
    href: '/chat', 
    icon: 'MessageCircle',
    description: 'AI-powered chat assistant'
  },
  { 
    id: 'settings',
    label: 'Settings', 
    href: '/settings', 
    icon: 'Settings',
    description: 'Application settings'
  },
  { 
    id: 'about',
    label: 'About', 
    href: '/about', 
    icon: 'Info',
    description: 'About PhishGuard AI'
  },
] as const;

export type NavItem = typeof NAV_ITEMS[number];
export type NavItemId = NavItem['id'];
