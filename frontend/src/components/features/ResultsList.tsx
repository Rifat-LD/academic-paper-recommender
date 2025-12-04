import React from 'react';
import PaperCard from '../ui/PaperCard';
import { Search, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Paper {
    id: number;
    title: string;
    authors: string;
    year: number;
    abstract: string;
    relevanceScore: number;
}

interface ResultsListProps {
    papers: Paper[];
    isLoading: boolean;
    error?: string | null;
    totalResults: number;
    sortBy: string;
    onSortChange: (value: string) => void;

    // NEW PAGINATION PROPS
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({
                                                     papers,
                                                     isLoading,
                                                     error,
                                                     totalResults,
                                                     sortBy,
                                                     onSortChange,
                                                     currentPage,    // <--- New
                                                     totalPages,     // <--- New
                                                     onPageChange    // <--- New
                                                 }) => {

    // Loading State
    if (isLoading) {
        return (
            <div className="text-center py-16 col-span-full animate-pulse">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-5 animate-spin"></div>
                <p className="text-xl text-gray-500 font-medium">Searching through academic papers...</p>
                <p className="text-sm text-gray-400 mt-2">Analyzing semantic meaning</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="text-center py-16 col-span-full bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-5" />
                <h3 className="text-2xl font-bold mb-3 text-red-600 dark:text-red-400">Search Failed</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button className="bg-primary hover:bg-secondary text-white py-2 px-6 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        );
    }

    // Empty State
    if (totalResults === 0) {
        return (
            <div className="text-center py-16 col-span-full">
                <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No papers found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find what you're looking for.
                </p>
            </div>
        );
    }

    // Results Grid
    return (
        <section className="mb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 gap-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-3">
                    Results <span className="bg-primary/10 text-primary text-sm py-1 px-3 rounded-full font-bold">{totalResults} papers</span>
                </h2>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select
                        className="bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-1.5 px-3 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="Relevance">Relevance</option>
                        <option value="Date (Newest)">Date (Newest)</option>
                        <option value="Date (Oldest)">Date (Oldest)</option>
                        <option value="Title (A-Z)">Title (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {papers.map((paper, index) => (
                    <div
                        key={paper.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <PaperCard paper={paper} />
                    </div>
                ))}
            </div>

            {/* PAGINATION CONTROLS (Phase 4.3) */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300 font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Page <span className="text-primary">{currentPage}</span> of {totalPages}
                    </span>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300 font-medium"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default ResultsList;