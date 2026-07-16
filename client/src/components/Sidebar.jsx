import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  Settings, 
  LogOut, 
  FileText,
  X 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const allNavLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'CA', 'Client'] },
    { name: 'Clients', path: '/clients', icon: Users, roles: ['Admin', 'CA'] },
    { name: 'Upload PDF', path: '/upload', icon: UploadCloud, roles: ['Admin', 'CA', 'Client'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'CA', 'Client'] },
  ];

  const navLinks = allNavLinks.filter((link) => link.roles.includes(user?.role));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 border-r border-slate-900 text-slate-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-2 shadow-lg shadow-primary-500/20">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              TaxReview <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
          <button 
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1.5 py-8 px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/10 to-indigo-500/5 border border-primary-500/20 text-primary-400 shadow-sm shadow-primary-500/5'
                      : 'text-slate-400 hover:bg-slate-900/45 hover:text-slate-200 border border-transparent'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
