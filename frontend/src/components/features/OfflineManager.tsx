import React, { useState, useEffect } from 'react';
import { Trash2, Database, Clock, HardDrive } from 'lucide-react';
import { useFavoritesStore } from '../../store/favoritesStore';

export default function OfflineManager() {
    const { favorites, clearFavorites, getStorageUsage } = useFavoritesStore();
    const [usageBytes, setUsageBytes] = useState(0);

    // Update usage on render
    useEffect(() => {
        setUsageBytes(getStorageUsage());
    }, [favorites, getStorageUsage]);

    // Convert bytes to KB
    const usageKB = (usageBytes / 1024).toFixed(2);
    // Browser localStorage limit is usually ~5MB (5120KB)
    const usagePercent = Math.min((usageBytes / (5 * 1024 * 1024)) * 100, 100);

    const handleClear = () => {
        if (window.confirm("Are you sure? This will remove all saved papers from your device.")) {
            clearFavorites();
        }
    };

    return (
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-4 flex items-center gap-2">
                <HardDrive size={20} />
                Offline Storage Manager
            </h3>

            {/* 1. Storage Usage Visualization */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Used Space</span>
                    <span className="font-mono text-primary font-bold">{usageKB} KB</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(usagePercent, 1)}%` }} // Always show at least a sliver
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Browser limit: ~5MB. You have plenty of space!
                </p>
            </div>

            {/* 2. Cached Papers Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-light dark:bg-dark-bg p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold mb-1">
                        <Database size={12} /> Papers
                    </div>
                    <div className="text-2xl font-bold text-dark dark:text-light">
                        {favorites.length}
                    </div>
                </div>
                <div className="bg-light dark:bg-dark-bg p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold mb-1">
                        <Clock size={12} /> Newest
                    </div>
                    <div className="text-sm font-medium text-dark dark:text-light pt-1">
                        {favorites.length > 0
                            ? new Date(favorites[0].savedAt).toLocaleDateString()
                            : "N/A"}
                    </div>
                </div>
            </div>

            {/* 3. Cache Clearing Controls */}
            <button
                onClick={handleClear}
                disabled={favorites.length === 0}
                className="w-full flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Trash2 size={16} />
                Clear Offline Cache
            </button>
        </div>
    );
}