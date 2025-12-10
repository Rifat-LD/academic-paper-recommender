import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

const TIPS = [
    "Our AI converts your text into 384-dimensional vectors to understand context.",
    "You can search using natural language like 'How does climate change affect agriculture?'",
    "All processing happens locally on your CPU. No data leaves your machine.",
    "The initial setup only happens once. Future startups will be instant.",
    "You can save papers to your Favorites for offline reading later.",
    "Dark mode saves battery life on OLED screens!"
];

export default function LoadingTips() {
    const [currentTip, setCurrentTip] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            setIsVisible(false);

            setTimeout(() => {
                // Change text and fade in
                setCurrentTip((prev) => (prev + 1) % TIPS.length);
                setIsVisible(true);
            }, 500); // Wait for fade out to finish

        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 max-w-lg mx-auto bg-primary/5 border border-primary/10 rounded-lg p-4 relative overflow-hidden min-h-[100px] flex items-center justify-center text-center">
            <div className="absolute top-2 left-2 text-primary/40">
                <Lightbulb size={20} />
            </div>

            <p className={`text-sm text-gray-600 dark:text-gray-300 transition-opacity duration-500 font-medium px-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <span className="font-bold text-primary block mb-1 text-xs uppercase tracking-wide">Did you know?</span>
                {TIPS[currentTip]}
            </p>
        </div>
    );
}