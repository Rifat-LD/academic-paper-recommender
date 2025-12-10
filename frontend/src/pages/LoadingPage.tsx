import React, { useState, useEffect, useCallback } from 'react';
import { Brain } from 'lucide-react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import ResourceMonitor, { SystemResources } from "../components/features/ResourceMonitor";

export default function LoadingPage() {
    const navigate = useNavigate();

    // UI States
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>("Initializing System...");
    const [details, setDetails] = useState<string>("Connecting to backend...");
    const [eta, setEta] = useState<number>(15);

    // Data States
    const [systemStats, setSystemStats] = useState<SystemResources | null>(null);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const [isBackendDown, setIsBackendDown] = useState(false);

    // Function to check backend health
    const checkBackend = useCallback(async () => {
        try {
            const response = await apiClient.get('/health');

            // If we get here, backend is alive!
            setIsBackendDown(false);
            setConnectionAttempts(0); // Reset failures

            // Update stats
            if (response.data.system) {
                setSystemStats(response.data.system);
            }

            // Check AI Status
            if (response.data.ai_engine_status === 'ready') {
                setProgress(100);
                setStatusMessage("System Ready");
                setDetails("Redirecting to search...");
                setTimeout(() => navigate('/'), 800);
                return true; // Done
            }
            return false; // Still loading AI
        } catch (error) {
            setConnectionAttempts(prev => prev + 1);
            return false; // Failed
        }
    }, [navigate]);

    // Effect 1: Progress Bar Animation Logic
    useEffect(() => {
        if (isBackendDown) return; // Stop animation if down

        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }

                // If we are getting too many errors, pause progress at 80%
                if (connectionAttempts > 2 && oldProgress > 80) {
                    return oldProgress;
                }

                // Normal simulation
                const increment = Math.random() * 5;
                const newProgress = Math.min(oldProgress + increment, 99);

                // Text updates
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

        return () => clearInterval(timer);
    }, [connectionAttempts, isBackendDown]);

    // Effect 2: Polling Logic
    useEffect(() => {
        const poller = setInterval(async () => {
            if (isBackendDown) return;

            const isReady = await checkBackend();
            if (isReady) clearInterval(poller);

            // If we failed 5 times in a row, declare backend down
            if (connectionAttempts > 5) {
                setIsBackendDown(true);
                setStatusMessage("Connection Failed");
                setDetails("Backend server is unreachable.");
            }
        }, 2000);

        return () => clearInterval(poller);
    }, [checkBackend, connectionAttempts, isBackendDown]);

    // Manual Retry Handler
    const handleRetry = () => {
        setConnectionAttempts(0);
        setIsBackendDown(false);
        setDetails("Retrying connection...");
        checkBackend();
    };

    return (
        <div className="min-h-screen bg-light dark:bg-dark-bg flex flex-col items-center justify-center p-4 transition-colors duration-300">

            {/* Brain Spinner */}
            <div className="relative mb-8">
                <div className={`absolute inset-0 rounded-full ${isBackendDown ? 'bg-red-500/20' : 'bg-primary/20 animate-ping'}`}></div>
                <div className="relative bg-white dark:bg-dark-surface p-6 rounded-full shadow-xl border border-gray-100 dark:border-gray-700">
                    <Brain className={`w-16 h-16 ${isBackendDown ? 'text-red-500' : 'text-primary animate-pulse'}`} />
                </div>
                {!isBackendDown && (
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                )}
            </div>

            <div className="w-full max-w-md text-center">
                <h1 className={`text-2xl font-bold mb-2 ${isBackendDown ? 'text-red-500' : 'text-secondary dark:text-primary'}`}>
                    {statusMessage}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm h-6">
                    {details}
                </p>

                {/* Progress Bar */}
                <div className="relative pt-1 mb-2">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                                isBackendDown
                                    ? 'text-red-600 bg-red-200'
                                    : 'text-primary bg-primary/10'
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

                {/* Footer Info */}
                <div className="flex justify-between text-xs text-gray-400">
                    <span>{isBackendDown ? 'Check server logs' : 'Resource Usage: Optimized'}</span>
                    <span>Est. Time: {isBackendDown ? '--' : Math.ceil(eta)}s</span>
                </div>

                {/* Resource Monitor with Error Handling */}
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