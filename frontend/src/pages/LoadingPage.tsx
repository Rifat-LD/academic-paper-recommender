import React, { useState, useEffect, useCallback } from 'react';
import { Brain, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import apiClient from '../api/client';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import ResourceMonitor, { SystemResources } from "../components/features/ResourceMonitor";

export default function LoadingPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user came here manually (via Footer)
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

    const checkBackend = useCallback(async () => {
        try {
            const response = await apiClient.get('/health');

            setIsBackendDown(false);
            setConnectionAttempts(0);

            if (response.data.system) {
                setSystemStats(response.data.system);
            }

            if (response.data.ai_engine_status === 'ready') {
                setProgress(100);

                if (isViewOnly) {
                    // MODE A: VIEW ONLY (Dashboard Mode)
                    // Do NOT redirect. Just show "Ready".
                    setStatusMessage("System Operational");
                    setDetails("Live monitoring active");
                } else {
                    // MODE B: STARTUP (Loading Mode)
                    // Redirect as normal
                    setStatusMessage("System Ready");
                    setDetails("Redirecting to search...");
                    setTimeout(() => navigate('/'), 800);
                }
                return true;
            }
            return false;
        } catch (error) {
            setConnectionAttempts(prev => prev + 1);
            return false;
        }
    }, [navigate, isViewOnly]);

    // Effect 1: Progress Bar Animation
    useEffect(() => {
        if (isBackendDown) return;

        // If in ViewOnly mode, just jump to 100% immediately (no fake loading)
        if (isViewOnly) {
            setProgress(100);
            return;
        }

        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                if (connectionAttempts > 2 && oldProgress > 80) return oldProgress;

                const increment = Math.random() * 5;
                const newProgress = Math.min(oldProgress + increment, 99);

                // Only update text if NOT in view mode
                if (!isViewOnly) {
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
                }

                setEta((prev) => Math.max(0, prev - 0.5));
                return newProgress;
            });
        }, 500);

        return () => clearInterval(timer);
    }, [connectionAttempts, isBackendDown, isViewOnly]);

    // Effect 2: Polling Logic
    useEffect(() => {
        // Run immediately on mount
        checkBackend();

        const poller = setInterval(async () => {
            if (isBackendDown) return;

            const isReady = await checkBackend();
            // If strictly loading, stop polling once ready.
            // If ViewOnly, KEEP polling forever (to update graphs).
            if (isReady && !isViewOnly) clearInterval(poller);

            if (connectionAttempts > 5) {
                setIsBackendDown(true);
                setStatusMessage("Connection Failed");
                setDetails("Backend server is unreachable.");
            }
        }, 2000);

        return () => clearInterval(poller);
    }, [checkBackend, connectionAttempts, isBackendDown, isViewOnly]);

    const handleRetry = () => {
        setConnectionAttempts(0);
        setIsBackendDown(false);
        setDetails("Retrying connection...");
        checkBackend();
    };

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">

            {/* BACK BUTTON (Only for ViewOnly Mode) */}
            {isViewOnly && (
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium bg-white dark:bg-dark-surface px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <ArrowLeft size={18} /> Back to Search
                </button>
            )}

            {/* Brain Spinner */}
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

                {/* Progress Bar (Hidden if viewing Dashboard) */}
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

                {/* Resource Monitor */}
                <div className="w-full mt-8">
                    <ResourceMonitor
                        resources={systemStats}
                        isLoading={!systemStats && !isBackendDown}
                        isError={isBackendDown}
                        onRetry={handleRetry}
                    />
                </div>
            </div>
        </div>
    );
}