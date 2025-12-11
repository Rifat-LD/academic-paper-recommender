import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import apiClient from './api/client'; // Import API client
import {useNetworkMonitoring } from "./hooks/useNetworkMonitoring.ts";

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import SearchPage from './pages/SearchPage';
import LoadingPage from './pages/LoadingPage';
import ErrorPage from './pages/ErrorPage';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // --- Theme Logic (Preserved) ---
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useNetworkMonitoring();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

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