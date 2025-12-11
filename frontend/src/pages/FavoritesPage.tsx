import React, { useState, useMemo } from 'react';
import {
    Search,
    Trash2,
    Heart,
    Layers,
    Clock,
    Sparkles,
    Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Imports
import PaperCard from '../components/ui/PaperCard';
import { useFavoritesStore } from '../store/favoritesStore';

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();

    // 1. Data Source
    const { favorites, removeFavorite } = useFavoritesStore();

    // 2. Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]); // Fixed type
    const [activeTab, setActiveTab] = useState('Recent');

    // 3. Filtering & Sorting Logic (FIXED)
    const processedFavorites = useMemo(() => {
        // A. Filter first
        let result = favorites;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(paper =>
                paper.title.toLowerCase().includes(lowerQuery) ||
                paper.abstract.toLowerCase().includes(lowerQuery) ||
                paper.authors.toLowerCase().includes(lowerQuery)
            );
        }

        // B. Sort based on activeTab
        return [...result].sort((a, b) => {
            switch (activeTab) {
                case 'Most Relevant':
                    return b.relevanceScore - a.relevanceScore;
                case 'By Category':
                    // We treat Title A-Z as category/topic sort for now
                    return a.title.localeCompare(b.title);
                case 'Recent':
                default:
                    // Sort by savedAt timestamp (Newest first)
                    // We handle case where savedAt might be missing (older versions)
                    return (b.savedAt || 0) - (a.savedAt || 0);
            }
        });
    }, [favorites, searchQuery, activeTab]);

    // 4. Bulk Actions Logic
    const isAllSelected = processedFavorites.length > 0 && selectedIds.length === processedFavorites.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(processedFavorites.map(p => p.id));
        }
    };

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleRemoveSelected = () => {
        if (window.confirm(`Remove ${selectedIds.length} papers from favorites?`)) {
            selectedIds.forEach(id => removeFavorite(id));
            setSelectedIds([]);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-light font-sans transition-colors duration-300">

            <main className="container mx-auto px-4 py-8 max-w-7xl">

                {/* Page Header */}
                <section className="text-center py-10 mb-8 bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-secondary dark:text-primary">
                        Your Saved Papers
                    </h1>
                    <div className="inline-block bg-primary text-white px-4 py-1 rounded-full font-bold text-sm shadow-sm">
                        {favorites.length} papers saved
                    </div>
                </section>

                {/* Search in Favorites */}
                <div className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="relative shadow-md rounded-full">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search within your saved papers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3.5 px-5 pl-12 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-surface text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>
                </div>

                {/* Tabs (Sorting) */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {[
                        { name: 'Recent', icon: Clock },
                        { name: 'Most Relevant', icon: Sparkles },
                        { name: 'By Category', icon: Layers }
                    ].map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold border transition-all
                                ${activeTab === tab.name
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary'
                            }
                            `}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Bulk Actions Bar */}
                {favorites.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-dark-surface p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                            <input
                                type="checkbox"
                                id="selectAll"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                                className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer accent-primary"
                            />
                            <label htmlFor="selectAll" className="font-semibold cursor-pointer select-none text-gray-700 dark:text-gray-300">
                                Select All ({selectedIds.length})
                            </label>
                        </div>

                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleRemoveSelected}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
                            >
                                <Trash2 className="w-4 h-4" /> Remove Selected
                            </button>
                        )}
                    </div>
                )}

                {/* Favorites Grid */}
                {processedFavorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {processedFavorites.map((paper) => (
                            <div key={paper.id} className="relative group">
                                {/* Checkbox Overlay */}
                                <div className="absolute top-3 right-3 z-30">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(paper.id)}
                                        onChange={() => toggleSelection(paper.id)}
                                        // Visual tweak: Add a subtle shadow/bg so it pops against dark headers
                                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer accent-primary shadow-sm"
                                    />
                                </div>

                                {/* Paper Card */}
                                <PaperCard paper={paper} />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 animate-fade-in">
                        {searchQuery ? (
                            <>
                                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-secondary dark:text-primary mb-2">No matches found</h3>
                                <p className="text-gray-500">No papers in your favorites match "{searchQuery}"</p>
                            </>
                        ) : (
                            <>
                                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-secondary dark:text-primary mb-2">No favorites yet</h3>
                                <p className="text-gray-500 mb-6">Start searching to add papers to your library.</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:-translate-y-1"
                                >
                                    <Brain className="w-5 h-5" /> Start Searching
                                </button>
                            </>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
};

export default FavoritesPage;