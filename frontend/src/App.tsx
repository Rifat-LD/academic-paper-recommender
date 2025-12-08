import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routing Tools

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import SearchPage from './pages/SearchPage';
import LoadingPage from './pages/LoadingPage'; // Import the new page

function App() {
    // --- Theme Logic (Preserved) ---
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        // Global Layout Wrapper (Preserved)
        <div className={`${isDark ? 'dark' : ''} flex flex-col min-h-screen font-sans bg-light text-dark dark:bg-dark-bg dark:text-light transition-colors duration-300`}>

            <Header isDark={isDark} toggleTheme={toggleTheme} />

            {/* Main Content Area: Now dynamic based on URL */}
            <main className="flex-grow">
                <Routes>
                    {/* Phase 1: Search Page */}
                    <Route path="/" element={<SearchPage />} />

                    {/* Phase 2.2: Loading / System Status Page */}
                    <Route path="/loading" element={<LoadingPage />} />

                    {/* Fallback: Redirect unknown URLs to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;