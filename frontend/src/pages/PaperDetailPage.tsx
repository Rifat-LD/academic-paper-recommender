import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Book,
    User,
    Lightbulb,
    Copy,
    Check,
    Download,
    Heart,
    ThumbsUp,
    ThumbsDown,
    ExternalLink
} from 'lucide-react';

// Components & Stores
import ErrorPage from './ErrorPage';
import { useFavoritesStore } from '../store/favoritesStore';
import { searchService, UIPaper } from '../api/papers';

const highlightText = (text: string, query?: string) => {
    if (!query) return text;

    // Split query into words, ignore small words
    const terms = query.split(/\s+/).filter(t => t.length > 3);
    if (terms.length === 0) return text;

    // Create regex: (term1|term2|term3) case insensitive
    const regex = new RegExp(`(${terms.join('|')})`, 'gi');

    // Wrap matches in span
    return text.replace(regex, `<span class="highlight">$1</span>`);
};

// --- CUSTOM HOOK: FEEDBACK PERSISTENCE ---
const usePaperFeedback = (paperId: string | undefined) => {
    const key = `feedback-${paperId}`;
    const [feedback, setFeedback] = useState<'up' | 'down' | null>(() => {
        return (localStorage.getItem(key) as 'up' | 'down' | null);
    });

    const toggleFeedback = (type: 'up' | 'down') => {
        if (!paperId) return;

        let newFeedback: 'up' | 'down' | null = type;
        if (feedback === type) newFeedback = null; // Toggle off

        setFeedback(newFeedback);

        if (newFeedback) {
            localStorage.setItem(key, newFeedback);
        } else {
            localStorage.removeItem(key);
        }
    };

    return { feedback, toggleFeedback };
};

const PaperDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Access Search Context
    const searchContext = location.state as { query?: string; explanation?: string } | null;
    const hasSearchContext = !!searchContext?.query;

    // Global State
    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

    // Local Data State
    const [paper, setPaper] = useState<UIPaper | null>(null);
    const [relatedPapers, setRelatedPapers] = useState<UIPaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // UI State
    const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago' | 'BibTeX'>('APA');
    const [isCopied, setIsCopied] = useState(false);

    // Feedback Hook
    const { feedback, toggleFeedback } = usePaperFeedback(id);

    // 1. FETCH PAPER DATA
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (!id) throw new Error("No ID");

                // A. Get Main Paper
                const data = await searchService.getPaperById(id);
                if (!data) throw new Error("Paper not found");

                if (hasSearchContext && searchContext?.query) {
                    data.abstract = highlightText(data.abstract, searchContext.query);
                } else {
                    data.abstract = data.abstract.replace(/<\/?span[^>]*>/g, "");
                }
                setPaper(data);

                // B. Get Related Papers
                const searchTerms = data.title.split(' ').slice(0, 5).join(' ');
                const related = await searchService.search(searchTerms, 4);
                setRelatedPapers(related.filter(p => p.id !== data.id).slice(0, 3));

                setError(false);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, hasSearchContext]);

    // 2. DYNAMIC CITATION LOGIC
    const getCitationText = () => {
        if (!paper) return '';
        const authorList = paper.authors || "Unknown Authors";
        const title = paper.title || "Untitled";
        const year = paper.year || new Date().getFullYear();

        switch (citationFormat) {
            case 'MLA': return `${authorList}. "${title}." ArXiv Preprint, ${year}.`;
            case 'Chicago': return `${authorList}. "${title}." ArXiv Preprint (${year}).`;
            case 'BibTeX': return `@article{${paper.id}, title={${title}}, author={${authorList}}, year={${year}}, journal={arXiv}}`;
            case 'APA':
            default: return `${authorList} (${year}). ${title}. ArXiv.`;
        }
    };

    const handleCopyCitation = () => {
        navigator.clipboard.writeText(getCitationText());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleToggleFavorite = () => {
        if (!paper) return;
        if (isFavorite(paper.id)) {
            removeFavorite(paper.id);
        } else {
            addFavorite(paper);
        }
    };

    // --- RENDER STATES ---

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-light dark:bg-dark-bg">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 animate-pulse">Retrieving paper details...</p>
            </div>
        );
    }

    if (error || !paper) {
        return <ErrorPage type="404" message="We couldn't find the paper you're looking for." />;
    }

    const isSaved = isFavorite(paper.id);

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-light font-sans transition-colors duration-300">

            <main className="container mx-auto px-4 py-6 max-w-6xl">

                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-primary hover:text-secondary dark:text-primary dark:hover:text-accent font-semibold mb-8 transition-transform hover:-translate-x-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Paper Header */}
                <article className="border-b-2 border-gray-200 dark:border-gray-700 pb-8 mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-secondary dark:text-primary leading-tight">
                        {paper.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 mb-4 text-gray-500 text-lg">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{paper.authors}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Published: {paper.year}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Book className="w-4 h-4" />
                            <span>arXiv:{paper.id}</span>
                        </div>
                        {/* RELEVANCE SCORE SECTION REMOVED COMPLETELY */}
                    </div>
                </article>

                <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1fr_350px]">

                    {/* Main Column */}
                    <div className="order-1">

                        {/* Abstract Section */}
                        <section className="mb-10 animate-fade-in">
                            <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                Abstract
                            </h2>
                            <div
                                className="text-dark dark:text-gray-200 leading-loose text-lg
                                [&_.highlight]:bg-yellow-100 dark:[&_.highlight]:bg-yellow-900/30
                                [&_.highlight]:text-yellow-800 dark:[&_.highlight]:text-yellow-200
                                [&_.highlight]:px-1 [&_.highlight]:rounded"
                                dangerouslySetInnerHTML={{ __html: paper.abstract }}
                            />
                        </section>

                        {/* Contextual Recommendation (Only if from Search) */}
                        {hasSearchContext && (
                            <section className="mb-10 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-primary p-6 rounded-r-lg animate-fade-in">
                                <div className="flex items-center gap-2 text-lg font-bold text-primary mb-3">
                                    <Lightbulb className="w-5 h-5" />
                                    Context Match
                                </div>
                                <p className="text-dark dark:text-gray-300 leading-relaxed">
                                    {searchContext?.explanation || "This paper contains semantic concepts strongly related to your search query."}
                                </p>
                            </section>
                        )}

                        {/* Citation Block */}
                        <section className="mb-10 bg-white dark:bg-dark-surface p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-4">Citation</h3>

                            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
                                {['APA', 'MLA', 'Chicago', 'BibTeX'].map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setCitationFormat(fmt as any)}
                                        className={`pb-2 px-2 font-semibold transition-colors ${citationFormat === fmt ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-dark dark:hover:text-light'}`}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 font-mono text-sm text-dark dark:text-gray-300 mb-4 break-words select-all">
                                {getCitationText()}
                            </div>

                            <button
                                onClick={handleCopyCitation}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm
                                    ${isCopied ? 'bg-green-100 text-green-700' : 'bg-primary text-white hover:bg-secondary'}
                                `}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {isCopied ? 'Copied' : 'Copy Citation'}
                            </button>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="order-2">
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 mb-8 animate-fade-in">
                            {/* Functional Download Button */}
                            <a
                                href={paper.url || `https://arxiv.org/pdf/${paper.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white py-3 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5 no-underline"
                            >
                                <Download className="w-5 h-5" />
                                Read Full PDF <ExternalLink size={14} className="opacity-70" />
                            </a>

                            <button
                                onClick={handleToggleFavorite}
                                className={`
                                    flex items-center justify-center gap-2 border py-3 rounded-xl font-semibold transition-colors
                                    ${isSaved
                                    ? 'border-accent text-accent bg-accent/10 dark:bg-accent/20'
                                    : 'border-gray-300 dark:border-gray-600 text-dark dark:text-light hover:bg-light dark:hover:bg-dark-surface'
                                }
                                `}
                            >
                                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
                            </button>

                            {/* Feedback System */}
                            <div className="flex gap-4 justify-center mt-2">
                                <button
                                    onClick={() => toggleFeedback('up')}
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${feedback === 'up' ? 'border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 text-gray-400 hover:border-green-500'}`}
                                >
                                    <ThumbsUp className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => toggleFeedback('down')}
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${feedback === 'down' ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 text-gray-400 hover:border-red-500'}`}
                                >
                                    <ThumbsDown className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Related Papers */}
                        <section className="animate-fade-in">
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                Related Papers
                            </h3>
                            <div className="space-y-4">
                                {relatedPapers.length > 0 ? (
                                    relatedPapers.map((relPaper) => (
                                        <Link
                                            to={`/paper/${relPaper.id}`}
                                            key={relPaper.id}
                                            className="block bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary/50 transition-all no-underline group"
                                        >
                                            <h4 className="font-bold text-secondary dark:text-primary mb-2 line-clamp-2 text-sm group-hover:text-primary">
                                                {relPaper.title}
                                            </h4>
                                            <div className="text-xs text-gray-500 mb-2">{relPaper.authors.substring(0, 40)}...</div>
                                            <div className="bg-gray-100 dark:bg-gray-800 text-dark dark:text-gray-200 text-xs font-semibold px-2 py-1 rounded inline-block">
                                                {relPaper.year}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No related papers found.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default PaperDetailPage;