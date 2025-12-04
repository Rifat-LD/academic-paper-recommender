import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import SearchPage from './pages/SearchPage';
// We should also create a simple Footer to match the design
import Footer from './components/layout/Footer';

function App() {
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
        // This div now controls the global background and text colors
        <div className={`${isDark ? 'dark' : ''} font-sans bg-light text-dark dark:bg-dark-bg dark:text-light transition-colors duration-300`}>
            <Header isDark={isDark} toggleTheme={toggleTheme} />
            <SearchPage />
            <Footer />
        </div>
    );
}

export default App;