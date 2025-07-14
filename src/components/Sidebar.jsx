import React from 'react';
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
import logo from '@/assets/logo_noslogan.png';
import { supabase } from '@/lib/supabaseClient'; // pastikan ini sesuai

const Sidebar = ({ className = '', collapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Item Master Data', icon: FileText, path: '/item' },
    { label: 'Sales Order', icon: FileText, path: '/salesorder' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div
      className={cn(
        'h-full bg-white border-r px-3 py-4 flex flex-col justify-between transition-all duration-300',
        collapsed ? 'w-[80px]' : 'w-[280px]',
        className
      )}
    >
      <div>
        {/* Collapse Button */}
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* Logo */}
        {!collapsed && (
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="Logo" className="h-8" />
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Button
                key={item.path}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-12',
                  isActive && 'bg-secondary'
                )}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
