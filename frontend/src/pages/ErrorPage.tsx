import React, { useState } from 'react';
import {
    WifiOff,
    ServerCrash,
    FileQuestion,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Home,
    Activity,
    Trash2,
    LifeBuoy,
    Mail,
    Book,
    Bug
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Define the supported error types
type ErrorType = '404' | '500' | 'network';

interface ErrorPageProps {
    type?: ErrorType;
    message?: string;
    details?: string;
}

// Configuration for visual indicators based on Error Type
const ERROR_CONFIG = {
    '404': {
        icon: FileQuestion,
        color: 'text-yellow-500',
        title: 'Page Not Found',
        description: "The page you are looking for doesn't exist or has been moved.",
        code: 'ERROR: NOT_FOUND (404)'
    },
    '500': {
        icon: ServerCrash,
        color: 'text-red-500',
        title: 'System Error',
        description: "Something went wrong on our servers. We are working to fix this.",
        code: 'ERROR: INTERNAL_SERVER_ERROR (500)'
    },
    'network': {
        icon: WifiOff,
        color: 'text-primary', // Blue/Gray tone from your primary palette
        title: 'Connection Error',
        description: "We couldn't establish a connection to the semantic analysis service. This could be due to a temporary network issue.",
        code: 'ERROR: CONNECTION_TIMEOUT (503)'
    }
};

const ErrorPage: React.FC<ErrorPageProps> = ({
                                                 type = 'network', // Default to network as per the HTML provided
                                                 message,
                                                 details
                                             }) => {
    // State
    const [showDetails, setShowDetails] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryStatus, setRetryStatus] = useState<'idle' | 'success' | 'failed'>('idle');

    // Get config based on type
    const config = ERROR_CONFIG[type];
    const IconComponent = config.icon;

    // Handlers
    const handleRetry = () => {
        setIsRetrying(true);
        setRetryStatus('idle');

        // Simulate reconnection attempt
        setTimeout(() => {
            const isSuccess = Math.random() > 0.3; // 70% chance of success
            setIsRetrying(false);
            setRetryStatus(isSuccess ? 'success' : 'failed');

            if (isSuccess) {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }, 2000);
    };

    const handleClearCache = () => {
        if (window.confirm('Clear your browser cache? This may resolve connection issues.')) {
            // In a real app: localStorage.clear();
            window.location.reload();
        }
    };

    // Dummy toggle theme for Header (assuming this is managed in App.tsx usually)
    // We pass a dummy function here just to make the Header render without crashing
    const dummyToggleTheme = () => document.documentElement.toggleAttribute('data-theme');

    return (
        <div className="flex flex-col min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-light font-sans transition-colors duration-300">
            <main className="container mx-auto px-4 flex-grow max-w-5xl">

                {/* 1. Hero / Main Error Section */}
                <section className="text-center py-16 mb-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl animate-fade-in dark:from-primary/10 dark:to-secondary/10">
                    <IconComponent className={`w-20 h-20 mx-auto mb-6 ${config.color} animate-pulse`} />
                    <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${config.color}`}>
                        {config.title}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto dark:text-gray-400">
                        {message || config.description}
                    </p>
                </section>

                {/* 2. Expandable Technical Details */}
                <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-1">

                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
                            <div className="flex items-center gap-4">
                                <Bug className={`w-8 h-8 ${config.color}`} />
                                <h2 className={`text-2xl font-bold ${config.color}`}>Error Details</h2>
                            </div>
                            <button className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                                {showDetails ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                            </button>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 mt-4 mb-2">
                            Please don't worry - this is usually a temporary issue. Below are the technical details:
                        </p>

                        {/* Collapsible Content */}
                        {showDetails && (
                            <div className="mt-6 animate-fade-in">
                                <div className="bg-light dark:bg-[#1a1a1a] border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-dark dark:text-light overflow-x-auto leading-relaxed">
                                    {details || (
                                        <>
                                            {config.code}<br/>
                                            SERVICE: semantic_analysis_engine<br/>
                                            TIMESTAMP: {new Date().toISOString()}<br/>
                                            BROWSER: {navigator.userAgent}
                                        </>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-bold mb-3 text-secondary dark:text-primary">Possible Causes:</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-dark dark:text-gray-300 marker:text-red-500 marker:font-bold">
                                        <li>Your internet connection is unstable or offline</li>
                                        <li>The semantic analysis service is temporarily overloaded</li>
                                        <li>Firewall or network restrictions are blocking the connection</li>
                                        <li>Your local cache needs to be refreshed</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Recovery Actions Grid */}
                <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2">Quick Recovery Steps</h2>
                        <p className="text-gray-500 dark:text-gray-400">Try these solutions in order. Most issues are resolved with the first step!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Action 1: Retry (Dynamic Status) */}
                        <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                            <RefreshCw className={`w-12 h-12 mx-auto mb-4 text-primary ${isRetrying ? 'animate-spin' : ''}`} />
                            <h3 className="text-xl font-bold mb-3 text-secondary dark:text-primary">Retry Connection</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                                Attempt to reconnect to the service. This resolves 85% of issues.
                            </p>
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying || retryStatus === 'success'}
                                className={`
                                    inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg
                                    ${retryStatus === 'success'
                                    ? 'bg-gradient-to-r from-green-500 to-teal-400'
                                    : retryStatus === 'failed'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : 'bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50'
                                }
                                `}
                            >
                                {isRetrying ? 'Connecting...' : retryStatus === 'success' ? 'Restored!' : retryStatus === 'failed' ? 'Failed' : 'Retry Now'}
                            </button>
                        </div>

                        {/* Action 2: Check Internet */}
                        <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                            <Activity className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-xl font-bold mb-3 text-secondary dark:text-primary">Check Internet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                                Verify your internet is working by opening another website.
                            </p>
                            <button
                                onClick={() => window.open('https://google.com', '_blank')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transition-all"
                            >
                                <Activity className="w-4 h-4" /> Test Connection
                            </button>
                        </div>

                        {/* Action 3: Clear Cache */}
                        <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform">
                            <Trash2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-xl font-bold mb-3 text-secondary dark:text-primary">Clear Cache</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                                Corrupted cache files can cause issues. Clearing them often helps.
                            </p>
                            <button
                                onClick={handleClearCache}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" /> Clear Cache
                            </button>
                        </div>

                    </div>
                </section>

                {/* 4. Support Section */}
                <section className="bg-[#fff8e1] dark:bg-[#33270d] border-l-4 border-amber-400 rounded-2xl p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <LifeBuoy className="w-6 h-6 text-amber-600 dark:text-amber-200" />
                        <h3 className="text-xl font-bold text-amber-800 dark:text-amber-100">Need Additional Help?</h3>
                    </div>
                    <p className="text-dark dark:text-gray-200 mb-6">
                        If the issue persists after trying the steps above, our support team is here to help. We respond to all inquiries within 24 hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="#" className="flex items-center gap-2 font-semibold text-primary hover:text-secondary hover:underline transition-colors">
                            <Mail className="w-5 h-5" /> Email Support
                        </a>
                        <a href="#" className="flex items-center gap-2 font-semibold text-primary hover:text-secondary hover:underline transition-colors">
                            <Bug className="w-5 h-5" /> Report Issue
                        </a>
                        <a href="#" className="flex items-center gap-2 font-semibold text-primary hover:text-secondary hover:underline transition-colors">
                            <Book className="w-5 h-5" /> Documentation
                        </a>
                    </div>
                </section>

                {/* 5. Nav Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" /> Return to Homepage
                    </button>
                    <button className="bg-transparent border-2 border-gray-300 dark:border-gray-600 text-dark dark:text-light hover:bg-light dark:hover:bg-dark-surface px-8 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2">
                        <WifiOff className="w-5 h-5" /> View Cached Papers
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ErrorPage;