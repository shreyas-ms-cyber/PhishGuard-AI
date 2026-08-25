import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Single source of truth - only one Sidebar component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content area with proper spacing */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with menu toggle */}
        <header className="lg:hidden flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
            PhishGuard AI
          </h1>
        </header>

        {/* Page content - scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
