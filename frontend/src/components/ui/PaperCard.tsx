import React, { useState } from 'react';
import { Eye, Heart } from 'lucide-react';

interface PaperProps {
    id: string | number;
    title: string;
    authors: string;
    year: number;
    abstract: string; // Can contain HTML for highlights
    relevanceScore: number;
}

interface PaperCardProps {
    paper: PaperProps;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
    const [isSaved, setIsSaved] = useState(false);

    const toggleSave = () => {
        setIsSaved(!isSaved);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            {/* Card Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-2 text-secondary dark:text-primary leading-tight line-clamp-2">
                    {paper.title}
                </h3>
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-1.5 leading-relaxed">
                    {paper.authors}
                </div>
                <div className="inline-block bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded text-xs font-semibold">
                    {paper.year}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-grow">
                {/* Abstract with Line Clamp and Dangerous HTML for highlighting spans */}
                <p
                    className="text-gray-800 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4 [&_.highlight]:bg-primary/10 [&_.highlight]:text-primary [&_.highlight]:px-1 [&_.highlight]:rounded [&_.highlight]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: paper.abstract }}
                />

                {/* Relevance Bar */}
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-success to-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${paper.relevanceScore}%` }}
                    ></div>
                </div>
                <div className="text-xs text-gray-500 font-semibold text-right">
                    {paper.relevanceScore}% relevant to your query
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 pb-4 pt-0 mt-auto">
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">

                    <button className="flex items-center gap-1.5 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 border-none cursor-pointer">
                        <Eye className="w-4 h-4" />
                        View Details
                    </button>

                    <button
                        onClick={toggleSave}
                        className={`
              flex items-center justify-center p-2 rounded-lg border transition-colors duration-300 cursor-pointer
              ${isSaved
                            ? 'text-primary dark:text-success border-transparent'
                            : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
            `}
                        aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PaperCard;