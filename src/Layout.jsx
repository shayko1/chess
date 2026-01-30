import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Home, Gamepad2, Trophy, Sparkles } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: 'בית', path: 'Home', icon: Home },
    { name: 'משחק', path: 'Chess', icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col" dir="rtl">
      {/* Magical Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-purple-50 to-white -z-10" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                Magical Chess
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPageName === item.name;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.name)}
                    className={`
                      relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300
                      ${isActive 
                        ? 'text-purple-700 font-semibold bg-purple-50' 
                        : 'text-slate-500 hover:text-purple-600 hover:bg-white'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© 2026 Magical Unicorn Academy 🦄</p>
      </footer>
    </div>
  );
}