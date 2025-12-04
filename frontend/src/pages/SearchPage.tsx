import React, { useState, useMemo } from 'react';
import SearchSection from '../components/features/SearchSection';
import ResultsList from '../components/features/ResultsList';

interface Paper {
    id: number;
    title: string;
    authors: string;
    year: number;
    abstract: string;
    relevanceScore: number;
}

// 1. CONSTANTS
const ITEMS_PER_PAGE = 6; // Shows 2 rows of 3 on desktop

const mockResults: Paper[] = [
    // ... (Keep your existing mock data here - duplicate the entries to test pagination if you want!)
    { id: 1, title: 'Deep Learning Approaches...', authors: 'Zhang, L.', year: 2023, abstract: 'This is abstract section', relevanceScore: 100 },
    { id: 2, title: 'Transformer Models...', authors: 'Patel, R.', year: 2024, abstract: 'This is abstract section', relevanceScore: 92 },
    { id: 3, title: 'Reinforcement Learning...', authors: 'Thompson, K.', year: 2023, abstract: 'This is abstract section', relevanceScore: 100 },
    { id: 4, title: 'Federated Learning...', authors: 'Williams, D.', year: 2024, abstract: '...', relevanceScore: 87 },
    { id: 5, title: 'Explainable AI...', authors: 'Martinez, C.', year: 2023, abstract: '...', relevanceScore: 85 },
    { id: 6, title: 'Transfer Learning...', authors: 'Nguyen, H.', year: 2024, abstract: '...', relevanceScore: 82 },
    // Adding duplicates just to demonstrate pagination works
    { id: 7, title: 'Quantum Computing in AI', authors: 'Schrödinger, E.', year: 2023, abstract: 'Exploring quantum states...', relevanceScore: 81 },
    { id: 8, title: 'Ethical AI Frameworks', authors: 'Good, T.', year: 2022, abstract: 'Defining morality in code...', relevanceScore: 78 },
];

export default function SearchPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Paper[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('Relevance');

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
        // Reset to page 1 on new search
        setCurrentPage(1);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (query.toLowerCase().includes("error")) throw new Error("Simulated failure");

            // Mock filtering
            const filtered = mockResults.filter(p =>
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                // Allow "all" query to show pagination
                query === "all"
            );

            // If "all", show everything to test pagination
            if (query === "all") {
                setResults(mockResults);
            } else {
                setResults(filtered);
            }

        } catch (err) {
            setError("Failed to fetch results.");
            setResults([]);
        } finally {
            setIsLoading(false);
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
                    />
                </div>
            </main>
        </div>
    );
}