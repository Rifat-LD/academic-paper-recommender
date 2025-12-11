import React, { useState } from 'react';
import { Brain, Moon, Sun, Menu, X, WifiOff } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navClass = (path: string) => `
        font-medium transition-colors duration-200 
        ${isActive(path)
        ? 'text-white bg-white/20 px-3 py-1.5 rounded-md'
        : 'text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-md'
    }
    `;

    return (
        <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-gradient-to-r from-primary to-secondary shadow-md">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Academic<span className="text-success">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        <Link to="/" className={navClass('/')}>Search</Link>
                        {/* Favorites will be built in Phase 3, linking to Offline for now */}
                        <Link to="/offline" className={navClass('/favorites')}>Favorites</Link>

                        <Link to="/settings" className={navClass('/settings')}>Settings</Link>

                        {/* NEW: Offline Dashboard Link */}
                        <Link to="/offline" className={`${navClass('/offline')} flex items-center gap-2 border border-white/20`}>
                            <WifiOff size={16} />
                            <span>Offline Status</span>
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="ml-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-white hover:bg-white/10"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-primary border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Search
                        </Link>
                        <Link
                            to="/offline"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Offline Status
                        </Link>
                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;