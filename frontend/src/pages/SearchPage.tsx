import React, { useState, useMemo } from 'react';
import SearchSection from '../components/features/SearchSection';
import ResultsList from '../components/features/ResultsList';
import { searchService, UIPaper } from '../api/papers';
//import OfflineManager from "../components/features/OfflineManager.tsx";

// 1. CONSTANTS
const ITEMS_PER_PAGE = 6; // Shows 2 rows of 3 on desktop


export default function SearchPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [results, setResults] = useState<UIPaper[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('Relevance');
    const [lastQuery, setLastQuery] = useState<string>('');

    // 2. PAGINATION STATE
    const [currentPage, setCurrentPage] = useState<number>(1);


    const validateQuery = (query: string): boolean => {
        if (!query.trim()) return false;
        if (query.trim().length < 3) {
            setError("Please enter at least 3 characters.");
            setResults([]);
            return false;
        }
        return true;
    };

    const handleSearch = async (query: string) => {
        setError(null);
        if (!validateQuery(query)) return;

        setIsLoading(true);
        setCurrentPage(1); // Reset pagination
        setLastQuery(query);

        try {
            // --- REAL API CALL START ---
            // We fetch all relevant papers (e.g., top 50) and let frontend paginate
            const data = await searchService.search(query, 50);
            setResults(data);
            // --- REAL API CALL END ---

        } catch (err: any) {
            console.error("Search Error:", err);
            // Handle Axios errors gracefully
            if (err.code === 'ERR_NETWORK') {
                setError("Cannot connect to server. Is the backend running?");
            } else {
                setError("Failed to fetch results. Please try again.");
            }
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        if (lastQuery) {
            handleSearch(lastQuery);
        }
    };

    // 3. SORTING LOGIC
    const sortedResults = useMemo(() => {
        const sortable = [...results];
        switch (sortBy) {
            case 'Date (Newest)': return sortable.sort((a, b) => b.year - a.year);
            case 'Date (Oldest)': return sortable.sort((a, b) => a.year - b.year);
            case 'Title (A-Z)': return sortable.sort((a, b) => a.title.localeCompare(b.title));
            default: return sortable.sort((a, b) => b.relevanceScore - a.relevanceScore);
        }
    }, [results, sortBy]);

    // 4. PAGINATION LOGIC
    const totalPages = Math.ceil(sortedResults.length / ITEMS_PER_PAGE);

    const paginatedResults = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedResults.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedResults, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // Scroll to top of results smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-light font-sans transition-colors duration-300">
            <main className="flex-grow">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SearchSection
                        onSearch={handleSearch}
                        isSearching={isLoading}
                    />

                    <ResultsList
                        papers={paginatedResults} // Pass sliced results
                        isLoading={isLoading}
                        error={error}
                        totalResults={sortedResults.length} // Pass total count
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onRetry={handleRetry}
                    />
                </div>
            </main>
            {/*// ... inside SearchPage.tsx return statement ...

            <main className="flex-grow">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SearchSection
                        onSearch={handleSearch}
                        isSearching={isLoading}
                    />

                    <ResultsList
                        papers={paginatedResults}
                        isLoading={isLoading}
                        error={error}
                        totalResults={sortedResults.length}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />

                     TEMP: Offline Manager for Testing Phase 2.4
                    <div className="mt-16 mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                        <OfflineManager />
                    </div>

                </div>
            </main>*/}
        </div>
    );
}