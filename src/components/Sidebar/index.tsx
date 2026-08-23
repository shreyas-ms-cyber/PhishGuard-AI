import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NAV_ITEMS } from '@/constants/navigation';
import { Shield, User, LogOut, LifeBuoy } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const router = useRouter();

  // Group items by section
  const groupedItems = NAV_ITEMS.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof NAV_ITEMS>);

  return (
    <>
      {/* Mobile overlay - fully opaque */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel - ALWAYS shows complete content */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[280px] 
          bg-[#111827] text-white
          flex flex-col 
          transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          shadow-2xl
        `}
      >
        {/* HEADER - ALWAYS shows icon, title, and VIGILANCE ACTIVE */}
        <div className="flex items-center space-x-3 p-5 border-b border-gray-700">
          <div className="flex-shrink-0">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">PhishGuard AI</h1>
            <span className="text-xs text-blue-300 font-medium tracking-wider">
              VIGILANCE ACTIVE
            </span>
          </div>
        </div>

        {/* NAVIGATION - ALWAYS shows all items including About */}
        <nav className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} className="mb-6">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                {section}
              </div>
              <ul className="space-y-1">
                {items.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          }
                        `}
                      >
                        <span className="flex-shrink-0 w-5 h-5 mr-3 text-current">
                          {/* Icon placeholder - replace with actual icons */}
                          <span className="inline-block w-5 h-5 bg-current/20 rounded" />
                        </span>
                        <span className="flex-1 text-sm">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* FOOTER - Account + Support + Logout */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          {/* User Account */}
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Test</p>
              <p className="text-xs text-gray-400">test@example.com</p>
            </div>
          </div>

          {/* Support */}
          <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white">
            <LifeBuoy className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Support</span>
          </button>

          {/* Logout */}
          <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
