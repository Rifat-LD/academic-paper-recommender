import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark dark:bg-dark-bg text-white text-center py-12 mt-12 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">

                    <div className="text-3xl font-bold mb-4 text-white">
                        Academic<span className="text-success">AI</span>
                    </div>

                    <p className="opacity-80 mb-4 text-sm leading-relaxed">
                        A semantic search system for academic papers that works offline and respects your privacy. Built with 🩵 for university students and researchers.
                    </p>

                    <div className="flex justify-center gap-5 mb-4">
                        <a href="#" className="text-white opacity-80 no-underline hover:opacity-100 hover:underline transition-opacity">About</a>
                        <a href="#" className="text-white opacity-80 no-underline hover:opacity-100 hover:underline transition-opacity">Documentation</a>
                        <a href="#" className="text-white opacity-80 no-underline hover:opacity-100 hover:underline transition-opacity">GitHub</a>
                        <a href="#" className="text-white opacity-80 no-underline hover:opacity-100 hover:underline transition-opacity">Contact</a>
                    </div>

                    <p className="opacity-70 text-xs">
                        © 2025 Academic Paper Recommender. Open Source Project. No data collected.
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;