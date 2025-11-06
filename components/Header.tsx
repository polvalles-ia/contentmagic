
import React from 'react';
import { NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon, MagicWandIcon, TextIcon, ImageIcon, AudioIcon } from './icons';

interface HeaderProps {
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTheme, toggleTheme }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="sticky top-0 z-30 w-full bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <MagicWandIcon />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary-start to-brand-primary-end">
              ContentMagic
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <NavLink to="/" className={navLinkClass}>
              <TextIcon /> Text
            </NavLink>
            <NavLink to="/image" className={navLinkClass}>
              <ImageIcon /> Image
            </NavLink>
            <NavLink to="/audio" className={navLinkClass}>
              <AudioIcon /> Audio
            </NavLink>
          </nav>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {currentTheme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </div>
       <nav className="md:hidden flex items-center justify-around p-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800">
            <NavLink to="/" className={navLinkClass}>
              <TextIcon /> <span className="hidden sm:inline">Text</span>
            </NavLink>
            <NavLink to="/image" className={navLinkClass}>
              <ImageIcon /> <span className="hidden sm:inline">Image</span>
            </NavLink>
            <NavLink to="/audio" className={navLinkClass}>
              <AudioIcon /> <span className="hidden sm:inline">Audio</span>
            </NavLink>
        </nav>
    </header>
  );
};

export default Header;
