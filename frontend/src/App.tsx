import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import apiClient from './api/client'; // Import API client
import {useNetworkMonitoring } from "./hooks/useNetworkMonitoring.ts";
import { useSettingsStore } from './store/settingsStore';


// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import SearchPage from './pages/SearchPage';
import LoadingPage from './pages/LoadingPage';
import ErrorPage from './pages/ErrorPage';
import SettingsPage from './pages/SettingsPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
    const { fontSize, lineHeight } = useSettingsStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = useLocation();

    // --- Theme Logic (Preserved) ---
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useNetworkMonitoring();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    // --- APPLY ACCESSIBILITY SETTINGS ---
    useEffect(() => {
        const root = document.documentElement;

        // Map abstract sizes to CSS percentages
        const sizeMap = {
            small: '90%',   // ~14.4px
            medium: '100%', // 16px (Default)
            large: '115%'   // ~18.4px
        };

        // Apply Font Size to Root (Tailwind 'rem' units will scale relative to this)
        root.style.fontSize = sizeMap[fontSize];

        // Apply Line Height globally
        document.body.style.lineHeight = lineHeight.toString();

    }, [fontSize, lineHeight]);

    // --- PHASE 2.2: AUTOMATIC LOADING REDIRECT ---
    useEffect(() => {
        const checkSystemHealth = async () => {
            // If we are already on the loading page, don't check (let the page handle itself)
            if (location.pathname === '/loading') return;

            try {
                const response = await apiClient.get('/health');

                // If AI is NOT ready, force user to the loading screen
                if (response.data.ai_engine_status !== 'ready') {
                    console.log("⚠️ AI Engine loading... Redirecting to initialization screen.");
                    navigate('/loading');
                }
            } catch (error) {
                // If backend is down completely, also go to loading (or error) page
                console.error("❌ Backend offline or unreachable");
                navigate('/loading');
            }
        };

        checkSystemHealth();
    }, []); // Empty dependency array = runs once on app mount

    return (
        <div className={`${isDark ? 'dark' : ''} flex flex-col min-h-screen font-sans bg-light text-dark dark:bg-dark-bg dark:text-light transition-colors duration-300`}>

            <Header isDark={isDark} toggleTheme={toggleTheme} />

            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/loading" element={<LoadingPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/settings"element={<SettingsPage />} />
                    <Route path="/error" element={<ErrorPage type="500" />} />
                    <Route path="/network-error" element={<ErrorPage type="network" />} />
                    <Route path="*" element={<ErrorPage type="404" />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;