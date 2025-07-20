import React from 'react';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@/assets/logo_noslogan.png';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Item Master Data', icon: FileText, path: '/item' },
  { label: 'Sales Order', icon: FileText, path: '/salesorder' },
];

const SidebarContent = ({ onNavigate }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full justify-between p-4 w-[260px] bg-white border-r">
      <div>
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Button
                key={item.path}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 h-10"
                onClick={() => {
                  onNavigate?.(); // close drawer on mobile
                  navigate(item.path);
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start gap-3 h-10"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </div>
  );
};

const ResponsiveSidebar = () => {
  return (
    <div className="md:flex hidden h-full">
      {/* Desktop sidebar */}
      <SidebarContent />
    </div>
  );
};

export const MobileSidebar = () => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="m-2">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent onNavigate={() => document.activeElement?.blur()} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ResponsiveSidebar;
