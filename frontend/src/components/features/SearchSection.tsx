import React, { useState } from 'react';
import { Search, Brain, Loader2 } from 'lucide-react';

interface SearchSectionProps {
    onSearch: (query: string) => void;
    isSearching: boolean; // Added logic prop
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        // Validation: Prevent search if empty or already searching
        if (query.trim() && !isSearching) {
            onSearch(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleTagClick = (tagQuery: string) => {
        if (!isSearching) {
            setQuery(tagQuery);
            onSearch(tagQuery);
        }
    };

    const exampleQueries = [
        "machine learning for healthcare",
        "climate change prediction models",
        "natural language processing in education",
        "quantum computing algorithms"
    ];

    return (
        <section className="text-center py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl mb-8 transition-colors duration-300 dark:from-primary/10 dark:to-secondary/10">

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-secondary dark:text-primary">
                Find Relevant Research Papers with Semantic Search
            </h1>

            <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
                Our AI understands the meaning behind your queries, not just keywords. Get explainable recommendations for your academic research.
            </p>

            {/* Search Container */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="relative w-full mb-4">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        disabled={isSearching}
                        className="w-full py-4 px-5 pl-12 rounded-full border-2 border-gray-200 dark:border-gray-700 text-lg transition-all duration-300 bg-white dark:bg-[#121212] text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                        placeholder="Search for research papers in plain language..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className={`bg-primary text-white py-3 px-7 rounded-full text-lg font-semibold transition-all duration-300 flex items-center gap-2 
                            ${isSearching
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-none'
                        }`}
                    >
                        {isSearching ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5" />
                                Find Relevant Papers
                            </>
                        )}
                    </button>

                    <span className="inline-block bg-[#ffc107] text-dark py-1 px-3 rounded-full text-sm font-semibold animate-pulse">
                        Offline Mode
                    </span>
                </div>
            </div>

            {/* Example Queries */}
            <div className="text-center mt-8">
                <h3 className="mb-4 text-gray-500 text-lg">Try these example queries:</h3>
                <div className="flex flex-wrap justify-center gap-2.5 mt-2.5">
                    {exampleQueries.map((q, index) => (
                        <button
                            key={index}
                            onClick={() => handleTagClick(q)}
                            disabled={isSearching}
                            className="bg-light dark:bg-dark-surface border border-gray-200 dark:border-gray-700 text-primary py-1.5 px-4 rounded-full cursor-pointer transition-all duration-300 text-sm shadow-sm hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-light disabled:hover:text-primary disabled:hover:translate-y-0"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SearchSection;