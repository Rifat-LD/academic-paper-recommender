import React from 'react';
import {
    WifiOff,
    Wifi,
    RefreshCw,
    Database,
    FileText,
    Heart,
    Clock,
    Brain,
    BookOpen,
    TriangleAlert,
    Info,
    Download,
    Settings,
    CheckCircle
} from 'lucide-react';

// Importing Components and Stores
import PaperCard from '../components/ui/PaperCard';
// Assuming these stores exist based on your instructions
import { useNetworkStore } from '../store/networkStore';
import { useFavoritesStore } from '../store/favoritesStore';

const OfflinePage: React.FC = () => {
    // 1. Architecture & State Integration
    const { isOnline } = useNetworkStore();
    const { favorites } = useFavoritesStore();

    // Handler for reconnect button
    const handleReconnect = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-light font-sans transition-colors duration-300">

            <main className="container mx-auto px-4 py-8 max-w-6xl">

                {/* 2. Offline Status Banner (Conditional Logic) */}
                <section className={`
                    text-center py-12 mb-8 rounded-2xl transition-all shadow-sm
                    ${isOnline
                    ? 'bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20'
                    : 'bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10'
                }
                `}>
                    <div className="container mx-auto px-4">
                        {isOnline ? (
                            <Wifi className="w-14 h-14 mx-auto mb-4 text-green-600 dark:text-green-400" />
                        ) : (
                            <WifiOff className="w-14 h-14 mx-auto mb-4 text-primary" />
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-secondary dark:text-primary">
                            {isOnline ? "Offline Dashboard Ready" : "You're Currently Offline"}
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
                            {isOnline
                                ? "You are back online! Your dashboard is synced and ready for offline use whenever you need it."
                                : "No internet connection detected. Don't worry - you can still access your cached papers and favorites. Some features may be limited until you're back online."
                            }
                        </p>

                        <button
                            onClick={handleReconnect}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                        >
                            <RefreshCw className="w-5 h-5" />
                            {isOnline ? "Refresh Data" : "Reconnect to Internet"}
                        </button>
                    </div>
                </section>

                {/* 3. Stats Section */}
                <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                        <Database className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-primary">Available Offline Data</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        You have cached data available for offline use. This includes your saved papers, recent searches, and the semantic search model.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stat 1 */}
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                            <FileText className="w-10 h-10 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-extrabold text-secondary dark:text-primary mb-1">1,000</div>
                            <div className="text-sm font-semibold text-gray-500">Cached Papers</div>
                        </div>
                        {/* Stat 2: Dynamic Favorites Count */}
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                            <Heart className="w-10 h-10 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-extrabold text-secondary dark:text-primary mb-1">
                                {favorites.length}
                            </div>
                            <div className="text-sm font-semibold text-gray-500">Saved Favorites</div>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                            <Clock className="w-10 h-10 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-extrabold text-secondary dark:text-primary mb-1">24</div>
                            <div className="text-sm font-semibold text-gray-500">Recent Searches</div>
                        </div>
                        {/* Stat 4 */}
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                            <Brain className="w-10 h-10 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-extrabold text-secondary dark:text-primary mb-1">100%</div>
                            <div className="text-sm font-semibold text-gray-500">Model Ready</div>
                        </div>
                    </div>
                </section>

                {/* 4. Cached Papers Grid (Dynamic) */}
                <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                        <BookOpen className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-primary">Your Cached Papers</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        These papers are available for reading and searching while offline.
                    </p>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((paper) => (
                                <div key={paper.id} className="relative group">
                                    <PaperCard paper={paper} />
                                    {/* Offline Indicator Badge overlay */}
                                    <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm pointer-events-none">
                                        <CheckCircle className="w-3 h-3" /> Offline Ready
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <Heart className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No favorite papers cached yet</h3>
                            <p className="text-sm text-gray-400 mt-1">Mark papers as favorites while online to read them here.</p>
                        </div>
                    )}
                </section>

                {/* 5. Preparation Section */}
                <section className="bg-light dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-3">Prepare for Offline Use</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Follow these steps to ensure you have the best offline experience when you're in areas with poor connectivity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-2">Download Full Dataset</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">In Settings, enable "Complete Offline Mode" to download all 1,000 papers.</p>
                        </div>
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-2">Save Important Papers</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Mark papers as favorites to ensure they're always available offline.</p>
                        </div>
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-2">Enable Background Sync</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Allow the app to sync new papers when you're online.</p>
                        </div>
                    </div>
                </section>

                {/* 6. Limitations Section */}
                <section className="bg-[#fff8e1] dark:bg-[#33270d] border-l-4 border-amber-400 rounded-2xl p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <TriangleAlert className="w-6 h-6 text-amber-600 dark:text-amber-200" />
                        <h3 className="text-xl font-bold text-amber-800 dark:text-amber-100">Offline Mode Limitations</h3>
                    </div>

                    <div className="text-dark dark:text-gray-200 pl-4">
                        <p className="mb-2 font-medium">While offline, you won't be able to:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>Download new papers or update the dataset</li>
                            <li>Access papers that aren't in your cached collection</li>
                            <li>Get real-time updates to the semantic search model</li>
                            <li>Sync your favorites across multiple devices</li>
                        </ul>
                        <div className="flex items-center gap-2 mt-4 font-semibold text-amber-900 dark:text-amber-100">
                            <Info className="w-5 h-5" />
                            <p>All your actions (searches, favorites, notes) will be saved locally and synced when you're back online.</p>
                        </div>
                    </div>
                </section>

                {/* 7. Actions Section */}
                <section className="text-center animate-fade-in pb-8" style={{ animationDelay: '0.5s' }}>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-secondary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                            <Download className="w-5 h-5" /> Download More Papers
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-dark dark:text-light hover:bg-light dark:hover:bg-dark-surface px-8 py-3 rounded-full font-bold transition-all">
                            <Settings className="w-5 h-5" /> Offline Settings
                        </button>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default OfflinePage;