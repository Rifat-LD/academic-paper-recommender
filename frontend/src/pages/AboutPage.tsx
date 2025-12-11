import React, { useState } from 'react';
import {
    Brain,
    Database,
    ShieldCheck,
    Heart,
    ArrowRight,
    FileText,
    RefreshCw,
    DownloadCloud,
    Cpu,
    Zap,
    Lock,
    UserX,
    Trash2,
    Code,
    Share2,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Github,
    ExternalLink,
    Mail
} from 'lucide-react';

const AboutPage: React.FC = () => {
    // State for collapsible technical section
    const [showTechnical, setShowTechnical] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-light font-sans transition-colors duration-300">

            <main className="container mx-auto px-4 py-8 max-w-5xl">

                {/* 1. Page Header */}
                <section className="text-center py-12 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl animate-fade-in dark:from-primary/10 dark:to-secondary/10 border border-primary/5">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-secondary dark:text-primary">
                        About This System
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Understanding how semantic search works and the technology behind our academic paper recommendation system
                    </p>
                </section>

                {/* 2. System Explanation: Semantic Search */}
                <section className="bg-white dark:bg-dark-surface rounded-2xl p-8 mb-12 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in transition-all hover:shadow-md hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <Brain className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-secondary dark:text-primary">How Semantic Search Works</h2>
                    </div>

                    <div className="text-dark dark:text-gray-300 space-y-4 mb-8 text-lg leading-relaxed">
                        <p>
                            Traditional search engines match keywords, but our system understands the <strong className="text-primary">meaning</strong> and <strong className="text-primary">context</strong> behind your queries. This is called <em>semantic search</em>.
                        </p>
                        <p>
                            For example, searching for "machine learning for climate prediction" finds papers about "neural networks for weather forecasting" because the system knows these concepts are related, even if they don't share the exact same words.
                        </p>
                    </div>

                    {/* Diagram Layout */}
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-8 border border-dashed border-gray-300 dark:border-gray-700 mb-8">
                        <h3 className="text-xl font-bold text-center mb-8 text-secondary dark:text-primary">Semantic Search Process</h3>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            <div className="flex flex-col items-center max-w-[200px] text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg shadow-primary/30">
                                    1
                                </div>
                                <span className="font-semibold text-dark dark:text-gray-200">Your Query</span>
                            </div>

                            <ArrowRight className="w-8 h-8 text-primary rotate-90 md:rotate-0" />

                            <div className="flex flex-col items-center max-w-[200px] text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg shadow-primary/30">
                                    2
                                </div>
                                <span className="font-semibold text-dark dark:text-gray-200">Semantic Vector</span>
                            </div>

                            <ArrowRight className="w-8 h-8 text-primary rotate-90 md:rotate-0" />

                            <div className="flex flex-col items-center max-w-[200px] text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg shadow-primary/30">
                                    3
                                </div>
                                <span className="font-semibold text-dark dark:text-gray-200">Similar Papers</span>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4 text-secondary dark:text-primary font-bold">Feature</th>
                                <th className="py-3 px-4 text-secondary dark:text-primary font-bold">Traditional Search</th>
                                <th className="py-3 px-4 text-secondary dark:text-primary font-bold">Our AI Search</th>
                            </tr>
                            </thead>
                            <tbody className="text-dark dark:text-gray-300">
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-3 px-4 font-semibold">Matching Method</td>
                                <td className="py-3 px-4 text-gray-500">Exact keyword matching</td>
                                <td className="py-3 px-4 text-primary font-medium">Conceptual understanding</td>
                            </tr>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-3 px-4 font-semibold">Vocabulary</td>
                                <td className="py-3 px-4 text-gray-500">Requires exact terms</td>
                                <td className="py-3 px-4 text-primary font-medium">Understands synonyms</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-semibold">Context</td>
                                <td className="py-3 px-4 text-gray-500">Often ignores context</td>
                                <td className="py-3 px-4 text-primary font-medium">Context-aware results</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 3. Data Sources */}
                <section className="bg-white dark:bg-dark-surface rounded-2xl p-8 mb-12 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in transition-all hover:shadow-md hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <Database className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-secondary dark:text-primary">Data Sources</h2>
                    </div>

                    <div className="space-y-8">
                        {/* arXiv Dataset */}
                        <div className="border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-secondary dark:text-primary">arXiv Dataset</h3>
                                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Primary Source</span>
                            </div>
                            <p className="text-dark dark:text-gray-300 mb-4 leading-relaxed">
                                A curated selection of Computer Science and related field papers from the arXiv preprint repository. We focus on recent publications (2020-2025) to ensure relevance to current research trends.
                            </p>
                            <div className="flex flex-wrap gap-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> 1,000 papers</div>
                                <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Updated weekly</div>
                                <div className="flex items-center gap-2"><DownloadCloud className="w-4 h-4" /> Local storage only</div>
                            </div>
                        </div>

                        {/* Collapsible Technical Details */}
                        <div className="pt-4">
                            <button
                                onClick={() => setShowTechnical(!showTechnical)}
                                className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
                            >
                                {showTechnical ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                {showTechnical ? 'Hide Technical Details' : 'Show Technical Details'}
                            </button>

                            {showTechnical && (
                                <div className="mt-6 space-y-8 animate-fade-in">
                                    <div className="border-b border-gray-100 dark:border-gray-800 pb-8">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-secondary dark:text-primary">Semantic Models</h3>
                                            <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">AI Technology</span>
                                        </div>
                                        <p className="text-dark dark:text-gray-300 mb-4 leading-relaxed">
                                            We use state-of-the-art sentence transformer models (all-MiniLM-L6-v2) that have been specifically trained to understand academic text.
                                        </p>
                                        <div className="flex flex-wrap gap-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            <div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU-only processing</div>
                                            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> No external API calls</div>
                                            <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> Pre-trained weights</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-secondary dark:text-primary">Vector Database</h3>
                                            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">Performance</span>
                                        </div>
                                        <p className="text-dark dark:text-gray-300 mb-4 leading-relaxed">
                                            Paper embeddings are stored using Numpy, optimized for fast similarity search even on standard hardware.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 4. Privacy Policy */}
                <section className="bg-white dark:bg-dark-surface rounded-2xl p-8 mb-12 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in transition-all hover:shadow-md hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-secondary dark:text-primary">Privacy Policy</h2>
                    </div>

                    <p className="text-dark dark:text-gray-300 mb-8 text-lg">
                        We take your privacy seriously. This system is designed with <strong>privacy by design</strong> principles:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border-l-4 border-primary">
                            <Lock className="w-6 h-6 text-primary mb-4" />
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-2">No Data Collection</h3>
                            <p className="text-dark dark:text-gray-400 text-sm leading-relaxed">
                                Your search queries, saved papers, and preferences are stored only on your device. Nothing is sent to external servers.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border-l-4 border-primary">
                            <UserX className="w-6 h-6 text-primary mb-4" />
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-2">Anonymous Usage</h3>
                            <p className="text-dark dark:text-gray-400 text-sm leading-relaxed">
                                We don't track your identity, IP address, or browsing behavior. The system works completely offline.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border-l-4 border-primary">
                            <Trash2 className="w-6 h-6 text-primary mb-4" />
                            <h3 className="text-lg font-bold text-secondary dark:text-primary mb-2">Data Control</h3>
                            <p className="text-dark dark:text-gray-400 text-sm leading-relaxed">
                                You have complete control over your data. Clear your browser storage anytime to remove all saved data.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. Acknowledgements & Tech Stack */}
                <section className="bg-white dark:bg-dark-surface rounded-2xl p-8 mb-12 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in transition-all hover:shadow-md hover:-translate-y-1" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <Heart className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-secondary dark:text-primary">Acknowledgements</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Python Community', icon: Code, desc: 'PyTorch, Transformers, FAISS', link: 'https://python.org' },
                            { title: 'Hugging Face', icon: Share2, desc: 'Pre-trained NLP models', link: 'https://huggingface.co' },
                            { title: 'arXiv.org', icon: BookOpen, desc: 'Open-access research archive', link: 'https://arxiv.org' },
                            { title: 'React', icon: Code, desc: 'Frontend Framework', link: 'https://react.dev' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-transform">
                                <item.icon className="w-6 h-6 text-primary mb-4" />
                                <h3 className="text-lg font-bold text-secondary dark:text-primary mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.desc}</p>
                                <a href={item.link} target="_blank" rel="noreferrer" className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline">
                                    Learn more <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. Contact & Support */}
                <section className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <Mail className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-secondary dark:text-primary">Contact & Support</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Report Issues', icon: Github, desc: 'Found a bug? Create an issue on GitHub.', link: '#', btnText: 'GitHub Issues' },
                            { title: 'General Feedback', icon: Mail, desc: 'Share your thoughts or suggest features.', link: '#', btnText: 'Send Feedback' },
                            { title: 'Documentation', icon: BookOpen, desc: 'Need help getting started? Check our docs.', link: '#', btnText: 'User Guide' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                                <item.icon className="w-6 h-6 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-secondary dark:text-primary mb-3">{item.title}</h3>
                                <p className="text-dark dark:text-gray-400 mb-6">{item.desc}</p>
                                <a href={item.link} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-primary/40 transition-transform hover:-translate-y-0.5">
                                    {idx === 0 ? <Github className="w-4 h-4" /> : idx === 1 ? <Mail className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                    {item.btnText}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

        </div>
    );
};

export default AboutPage;