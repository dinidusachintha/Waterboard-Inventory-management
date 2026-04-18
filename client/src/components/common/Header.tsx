import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Waterboard Inventory System
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                <User size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <ChevronDown size={16} />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full gap-3 px-4 py-2 text-left rounded-t-lg hover:bg-gray-50"
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full gap-3 px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full gap-3 px-4 py-2 text-left text-red-600 rounded-b-lg hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;