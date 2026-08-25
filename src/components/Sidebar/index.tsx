import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NAV_ITEMS } from '@/constants/navigation';
import { Shield, User, ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Always render the full sidebar content - no conditional logic that could hide items
  const renderHeader = () => (
    <div className="flex items-center space-x-3 p-4 border-b border-gray-700 dark:border-gray-600">
      <div className="flex-shrink-0">
        <Shield className="w-8 h-8 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-white truncate">PhishGuard AI</h1>
        <span className="text-xs text-blue-300 font-medium">VIGILANCE ACTIVE</span>
      </div>
    </div>
  );

  const renderNavItems = () => (
    <nav className="flex-1 p-3 overflow-y-auto">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`
                  flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-500/20 text-blue-400 font-medium' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                <span className="flex-shrink-0 w-5 h-5 mr-3">
                  {/* Icon placeholder - you can replace with actual icons */}
                  <span className="inline-block w-5 h-5 bg-blue-400/20 rounded" />
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const renderAccountCard = () => (
    <div className="p-4 border-t border-gray-700 dark:border-gray-600">
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">User Account</p>
          <p className="text-xs text-gray-400 truncate">user@phishguard.ai</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay - completely opaque to hide background content */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-40 lg:hidden"
          onClick={onClose}
          style={{ backdropFilter: 'none' }}
        />
      )}

      {/* Sidebar panel - always opaque with fixed width */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[280px] 
          bg-gray-900 dark:bg-gray-900 
          text-white 
          flex flex-col 
          transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          shadow-2xl
        `}
        style={{ 
          backgroundColor: '#111827', // Fully opaque dark gray
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none'
        }}
      >
        {renderHeader()}
        {renderNavItems()}
        {renderAccountCard()}
      </aside>
    </>
  );
}
