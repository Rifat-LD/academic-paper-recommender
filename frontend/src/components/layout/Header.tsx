import React, { useState } from 'react';
import { Brain, Moon, Sun, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Connect to Auth Store
    const { isAuthenticated, username, logout } = useAuthStore();

    const isActive = (path: string) => location.pathname === path;

    const navClass = (path: string) => `
        font-medium transition-colors duration-200 
        ${isActive(path)
        ? 'text-white bg-white/20 px-3 py-1.5 rounded-md'
        : 'text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-md'
    }
    `;

    const handleLogout = () => {
        setIsMenuOpen(false); // Close mobile menu if open
        logout(); // Clear state
        navigate('/login'); // Redirect
    };

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

                        {/* Protected Links: Only show if logged in */}
                        {isAuthenticated && (
                            <>
                                <Link to="/favorites" className={navClass('/favorites')}>Favorites</Link>
                                <Link to="/settings" className={navClass('/settings')}>Settings</Link>
                            </>
                        )}

                        <Link to="/about" className={navClass('/about')}>About</Link>

                        {/* Right Side: Theme + User Actions */}
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none"
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {/* Auth Status */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium pl-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                            <User size={16} />
                                        </div>
                                        <span className="hidden lg:inline max-w-[100px] truncate">{username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-white text-primary px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {/* Theme toggle on mobile bar */}
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 rounded-full bg-white/10 text-white"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

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
                <div className="md:hidden bg-primary border-t border-white/10 shadow-xl">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated && (
                            <div className="px-3 py-2 flex items-center gap-3 border-b border-white/10 mb-2">
                                <User size={20} className="text-white" />
                                <span className="text-white font-bold">{username}</span>
                            </div>
                        )}

                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
                            Search
                        </Link>

                        {isAuthenticated && (
                            <>
                                <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
                                    Favorites
                                </Link>
                                <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
                                    Settings
                                </Link>
                            </>
                        )}

                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
                            About
                        </Link>
                        <Link to="/offline" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
                            Offline Status
                        </Link>

                        {/* Mobile Auth Action */}
                        <div className="pt-2 mt-2 border-t border-white/10">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-red-200 hover:bg-white/10 hover:text-white"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-center px-3 py-3 rounded-md text-base font-bold bg-white text-primary mx-2 mt-1"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;