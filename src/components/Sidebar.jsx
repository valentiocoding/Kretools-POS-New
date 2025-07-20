import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import logo from '@/assets/logo_noslogan.png';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Item Master Data', icon: FileText, path: '/item' },
  { label: 'Sales Order', icon: FileText, path: '/salesorder' },
];

const Sidebar = ({ collapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    if (collapsed) {
      const timeout = setTimeout(() => setShowToggle(true), 300);
      return () => clearTimeout(timeout);
    }
    setShowToggle(false);
  }, [collapsed]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Floating Chevron When Collapsed */}
      {showToggle && (
        <div className="fixed top-6 left-0 z-40">
          <button
            onClick={onToggle}
            className="bg-white shadow p-1 rounded-r-md hover:bg-gray-100 transition"
            aria-label="Open sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-[80%] max-w-[280px] z-30 bg-white shadow-lg transition-transform duration-300 ease-in-out',
          collapsed ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <nav className="flex flex-col h-full px-4 py-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <img
              src={logo}
              width={140}
              alt="App Logo"
              className="object-contain"
            />
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded transition"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-1">
            {menuItems.map(({ label, icon: Icon, path }) => {
              const isActive = pathname === path;
              return (
                <Button
                  key={path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-11 text-base font-medium',
                    isActive && 'bg-secondary text-primary'
                  )}
                  onClick={() => 
                    {navigate(path)
                    onToggle();}
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 mt-auto"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
