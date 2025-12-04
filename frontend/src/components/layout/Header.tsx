import React from 'react';
import { Brain, Moon, Sun } from 'lucide-react';

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
    return (
        <header className="sticky top-0 z-50 w-full bg-gradient-to-br from-primary to-secondary text-white shadow-md transition-all duration-300">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Brain className="h-8 w-8" />
                        <div className="text-2xl font-bold">
                            Academic<span className="text-success">AI</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-5 flex-wrap justify-center">
                        <a href="#" className="font-medium text-white px-3 py-2 rounded transition-all duration-300 bg-white/20">
                            Search
                        </a>
                        <a href="#" className="font-medium text-white px-3 py-2 rounded transition-all duration-300 hover:bg-white/20">
                            Favorites
                        </a>
                        <a href="#" className="font-medium text-white px-3 py-2 rounded transition-all duration-300 hover:bg-white/20">
                            About
                        </a>
                        <a href="#" className="font-medium text-white px-3 py-2 rounded transition-all duration-300 hover:bg-white/20">
                            Settings
                        </a>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 border-none cursor-pointer"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </nav>

                </div>
            </div>
        </header>
    );
};

export default Header;