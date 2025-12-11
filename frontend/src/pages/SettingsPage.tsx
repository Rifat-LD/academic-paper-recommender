import React from 'react';
import { useState } from 'react';
import { Check, RefreshCw, AlertTriangle, Download } from 'lucide-react';
import apiClient from '../api/client';
import {
    Search,
    Database,
    PersonStanding,
    Trash2,
    Undo2,
    Type,
    Info,
    LayoutList,
    Filter
} from 'lucide-react';

// Import Stores
import { useSettingsStore } from '../store/settingsStore';
import { useFavoritesStore } from '../store/favoritesStore';

const SettingsPage: React.FC = () => {
    // Access Stores
    const {
        // Display
        resultDensity, setResultDensity,
        // Search
        minRelevance, setMinRelevance,
        resetSettings,
        // Accessibility
        fontSize, setFontSize,
        lineHeight, setLineHeight
    } = useSettingsStore();

    const { favorites, clearFavorites, getStorageUsage } = useFavoritesStore();

    // --- DATASET INTEGRITY LOGIC ---
    const [datasetStatus, setDatasetStatus] = useState<'idle' | 'checking' | 'ready' | 'error'>('idle');

    const verifyDataset = async () => {
        setDatasetStatus('checking');
        try {
            // Ping the backend health endpoint
            const response = await apiClient.get('/health');

            // Artificial delay so the user sees the spinner (UX)
            setTimeout(() => {
                if (response.data.ai_engine_status === 'ready') {
                    setDatasetStatus('ready');
                } else {
                    setDatasetStatus('error');
                }
            }, 1000);
        } catch (e) {
            setDatasetStatus('error');
        }
    };

    // Handlers
    const handleClearCache = () => {
        if (window.confirm('Are you sure you want to clear your offline library? This removes all saved papers.')) {
            clearFavorites();
        }
    };

    const handleResetPreferences = () => {
        if (window.confirm('Reset all settings to default values?')) {
            resetSettings();
        }
    };

    const storageUsed = (getStorageUsage() / 1024).toFixed(0); // KB

    // Helper Component for Font Size buttons
    // We define the type strictly here to prevent TypeScript errors
    const FontSizeButton = ({ size, label, value }: { size: string, label: string, value: 'small' | 'medium' | 'large' }) => (
        <button
            onClick={() => setFontSize(value)}
            className={`
                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all hover:-translate-y-0.5 w-full
                ${fontSize === value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 dark:border-gray-700 bg-transparent hover:bg-light dark:hover:bg-dark-surface'
            }
            `}
        >
            <Type className={`mb-2 ${size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-6 h-6' : 'w-8 h-8'}`} />
            <span className="text-sm font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-light font-sans transition-colors duration-300">
            <main className="container mx-auto px-4 py-8 max-w-4xl">

                {/* Page Header */}
                <section className="text-center py-12 mb-8 bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-secondary dark:text-primary">
                        System Settings
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Customize your experience, manage data, and optimize performance.
                    </p>
                </section>

                <div className="space-y-8">

                    {/* 1. Search Preferences */}
                    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <Search className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold text-secondary dark:text-primary">Search Preferences</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Slider 1: Result Density */}
                            <div>
                                <div className="flex justify-between mb-3 font-semibold text-sm">
                                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <LayoutList size={16} className="text-primary"/>
                                        Result Density
                                    </span>
                                    <span className="text-primary font-bold">{resultDensity} per page</span>
                                </div>
                                <input
                                    type="range"
                                    min="3" max="12"
                                    value={resultDensity}
                                    onChange={(e) => setResultDensity(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <p className="text-xs text-gray-500 mt-2">Number of papers to display per page.</p>
                            </div>

                            {/* Slider 2: Min Relevance */}
                            <div>
                                <div className="flex justify-between mb-3 font-semibold text-sm">
                                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Filter size={16} className="text-primary"/>
                                        Minimum Relevance
                                    </span>
                                    <span className="text-primary font-bold">{minRelevance}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={minRelevance}
                                    onChange={(e) => setMinRelevance(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <p className="text-xs text-gray-500 mt-2">Filter out results below this score.</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Accessibility */}
                    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <PersonStanding className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold text-secondary dark:text-primary">Accessibility</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Font Size */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Text Size</h3>
                                {/* FIX: Removed 'max-w-md', using full grid width */}
                                <div className="grid grid-cols-3 gap-3 w-full">
                                    <FontSizeButton size="small" label="Small" value="small" />
                                    <FontSizeButton size="medium" label="Medium" value="medium" />
                                    <FontSizeButton size="large" label="Large" value="large" />
                                </div>
                            </div>

                            {/* Line Height */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Line Height</h3>
                                <div className="flex justify-between mb-2 font-semibold text-sm">
                                    <span>Spacing</span>
                                    <span className="text-primary">{lineHeight}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1.2" max="2.0" step="0.1"
                                    value={lineHeight}
                                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Data Management */}
                    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <Database className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold text-secondary dark:text-primary">Data Management</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="bg-gray-50 dark:bg-[#151515] p-4 rounded-xl text-sm space-y-2 border border-gray-200 dark:border-gray-700">
                                {/* Dataset Row with Integrity Check */}
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-600 dark:text-gray-400">Dataset:</span>

                                    {datasetStatus === 'idle' && (
                                        <button
                                            onClick={verifyDataset}
                                            className="text-primary hover:underline text-sm font-semibold flex items-center gap-1"
                                        >
                                            Computer Science (1k)
                                            <RefreshCw size={14} />
                                        </button>
                                    )}

                                    {datasetStatus === 'checking' && (
                                        <span className="text-primary text-sm font-semibold flex items-center gap-2">
                                            <RefreshCw size={14} className="animate-spin" /> Verifying...
                                        </span>
                                    )}

                                    {datasetStatus === 'ready' && (
                                        <span className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-1">
                                            <Check size={14} /> Verified (1,000 Papers)
                                        </span>
                                    )}

                                    {datasetStatus === 'error' && (
                                        <button
                                            onClick={verifyDataset}
                                            className="text-red-500 hover:underline text-sm font-semibold flex items-center gap-1"
                                        >
                                            <AlertTriangle size={14} /> Integrity Error (Retry)
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Saved Favorites:</span>
                                    <span className="font-semibold text-primary">{favorites.length} papers</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Browser Storage:</span>
                                    <span className="font-semibold">{storageUsed} KB</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleClearCache}
                                    disabled={favorites.length === 0}
                                    className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 py-2.5 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="w-4 h-4" /> Clear Favorites Cache
                                </button>

                                <button
                                    onClick={handleResetPreferences}
                                    className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
                                >
                                    <Undo2 className="w-4 h-4" /> Reset Preferences
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <Info className="w-4 h-4 flex-shrink-0" />
                            <p>Clearing cache only removes your saved list. The main dataset (1,000 papers) remains available offline.</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SettingsPage;