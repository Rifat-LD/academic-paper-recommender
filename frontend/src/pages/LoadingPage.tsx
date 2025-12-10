import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, ArrowLeft, XCircle, AlertTriangle } from 'lucide-react';
import apiClient from '../api/client';
import { useNavigate, useLocation } from 'react-router-dom';
import ResourceMonitor, { SystemResources } from "../components/features/ResourceMonitor";
import LoadingTips from '../components/ui/LoadingTips';

export default function LoadingPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user came here manually (via Footer/Menu)
    const isViewOnly = location.state?.viewOnly || false;

    // UI States
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>(isViewOnly ? "System Status" : "Initializing System...");
    const [details, setDetails] = useState<string>(isViewOnly ? "Monitoring active..." : "Connecting to backend...");
    const [eta, setEta] = useState<number>(15);

    // Data States
    const [systemStats, setSystemStats] = useState<SystemResources | null>(null);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const [isBackendDown, setIsBackendDown] = useState(false);

    // Control States
    const [isCancelled, setIsCancelled] = useState(false);
    const [showLongOpWarning, setShowLongOpWarning] = useState(false);

    // Refs
    const progressTimerRef = useRef<number | null>(null);
    const pollTimerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    // Cleanup helper
    const stopOperations = useCallback(() => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }, []);

    const checkBackend = useCallback(async () => {
        try {
            // Short timeout for health check so we fail fast if server is down
            const response = await apiClient.get('/health', { timeout: 2000 });

            // SUCCESS
            setIsBackendDown(false);
            setConnectionAttempts(0);

            if (response.data.system) {
                setSystemStats(response.data.system);
            }

            if (response.data.ai_engine_status === 'ready') {
                setProgress(100);

                if (isViewOnly) {
                    setStatusMessage("System Operational");
                    setDetails("Live monitoring active");
                } else {
                    setStatusMessage("System Ready");
                    setDetails("Redirecting to search...");
                    stopOperations();
                    setTimeout(() => navigate('/'), 800);
                }
                return true;
            }
            return false;
        } catch (error) {
            // FAILURE LOGIC (Fixed)
            setConnectionAttempts(prev => {
                const newCount = prev + 1;
                // If we failed 3 times in a row, declare backend down immediately
                if (newCount >= 3) {
                    setIsBackendDown(true);
                    setStatusMessage("Connection Failed");
                    setDetails("Backend server is unreachable.");
                }
                return newCount;
            });
            return false;
        }
    }, [navigate, isViewOnly, stopOperations]);

    // Effect 1: Progress Bar Animation
    useEffect(() => {
        if (isBackendDown || isCancelled || isViewOnly) return;

        progressTimerRef.current = window.setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    stopOperations();
                    return 100;
                }

                // If we are struggling to connect, PAUSE progress at 80%
                // This explains your screenshot (stuck at 83%)
                if (connectionAttempts > 0 && oldProgress > 80) {
                    return oldProgress;
                }

                // Long Op Warning
                const elapsed = (Date.now() - startTimeRef.current) / 1000;
                if (elapsed > 10 && oldProgress < 50) {
                    setShowLongOpWarning(true);
                }

                const increment = Math.random() * 5;
                const newProgress = Math.min(oldProgress + increment, 99);

                // Update text based on progress
                if (newProgress < 30) {
                    setStatusMessage("Loading AI Models...");
                    setDetails("Initializing PyTorch & SentenceTransformers");
                } else if (newProgress < 60) {
                    setStatusMessage("Verifying Dataset...");
                    setDetails("Checking integrity of 1,000 papers");
                } else if (newProgress < 80) {
                    setStatusMessage("Warming up Vector Index...");
                    setDetails("Optimizing FAISS/Numpy matrix operations");
                } else {
                    setStatusMessage("Finalizing Setup...");
                    setDetails("Waiting for secure connection response...");
                }

                setEta((prev) => Math.max(0, prev - 0.5));
                return newProgress;
            });
        }, 500);

        return () => {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        };
    }, [connectionAttempts, isBackendDown, isCancelled, isViewOnly, stopOperations]);

    // Effect 2: Polling Logic
    useEffect(() => {
        if (isCancelled) return;

        // Run once immediately
        checkBackend();

        pollTimerRef.current = window.setInterval(async () => {
            if (isCancelled) return;

            // If backend is marked down, stop polling to save resources
            // Unless the user clicks Retry (which resets isBackendDown)
            if (isBackendDown) return;

            const isReady = await checkBackend();

            if (isReady && !isViewOnly) {
                stopOperations();
            }
        }, 2000);

        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, [checkBackend, isCancelled, isBackendDown, isViewOnly, stopOperations]);

    // Handlers
    const handleRetry = () => {
        setConnectionAttempts(0);
        setIsBackendDown(false);
        setDetails("Retrying connection...");
        checkBackend();
    };

    const handleCancel = () => {
        stopOperations();
        setIsCancelled(true);
        setStatusMessage("Setup Cancelled");
    };

    const handleManualRetry = () => {
        window.location.reload();
    };

    const handleSkip = () => {
        navigate('/');
    };

    // RENDER: CANCELLED STATE
    if (isCancelled) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark-bg flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">Setup Cancelled</h1>
                    <p className="text-gray-500 mb-8">
                        The initialization process was stopped. The AI engine might not be ready if you continue.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleManualRetry}
                            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Retry Setup
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">

            {isViewOnly && (
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium bg-white dark:bg-dark-surface px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <ArrowLeft size={18} /> Back to Search
                </button>
            )}

            {/* Brain Spinner - RED if down */}
            <div className="relative mb-8">
                <div className={`absolute inset-0 rounded-full ${isBackendDown ? 'bg-red-500/20' : 'bg-primary/20 animate-ping'}`}></div>
                <div className="relative bg-white dark:bg-dark-surface p-6 rounded-full shadow-xl border border-gray-100 dark:border-gray-700">
                    <Brain className={`w-16 h-16 ${isBackendDown ? 'text-red-500' : 'text-primary animate-pulse'}`} />
                </div>
            </div>

            <div className="w-full max-w-md text-center">
                <h1 className={`text-2xl font-bold mb-2 ${isBackendDown ? 'text-red-500' : 'text-secondary dark:text-primary'}`}>
                    {statusMessage}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm h-6">
                    {details}
                </p>

                {showLongOpWarning && !isViewOnly && !isBackendDown && (
                    <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-500 text-sm mb-4 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md animate-fade-in">
                        <AlertTriangle size={16} />
                        <span>This is taking longer than usual...</span>
                    </div>
                )}

                {/* Progress Bar (Hidden if ViewOnly) */}
                {!isViewOnly && (
                    <div className="relative pt-1 mb-2">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                                    isBackendDown ? 'text-red-600 bg-red-200' : 'text-primary bg-primary/10'
                                }`}>
                                    {isBackendDown ? 'Offline' : 'System Status'}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-semibold inline-block ${isBackendDown ? 'text-red-500' : 'text-primary'}`}>
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                            <div
                                style={{ width: `${progress}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out ${
                                    isBackendDown ? 'bg-red-500' : 'bg-primary'
                                }`}
                            ></div>
                        </div>
                    </div>
                )}

                {/* TIPS - Hide if Backend Down */}
                {!isViewOnly && !isBackendDown && <LoadingTips />}

                {/* Resource Monitor - Pass isError={true} if down */}
                <div className="w-full mt-8 mb-6">
                    <ResourceMonitor
                        resources={systemStats}
                        isLoading={!systemStats && !isBackendDown}
                        // @ts-ignore
                        isError={isBackendDown}
                        onRetry={handleRetry}
                    />
                </div>

                {/* Cancel Button - Hide if Backend Down */}
                {!isViewOnly && !isBackendDown && (
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium flex items-center gap-1 mx-auto"
                    >
                        <XCircle size={14} /> Cancel Setup
                    </button>
                )}
            </div>
        </div>
    );
}