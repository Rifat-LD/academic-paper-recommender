import React, {useState, useEffect} from 'react';
import {Brain, CheckCircle2, Server, Database} from 'lucide-react';
import apiClient from '../api/client';
import {useNavigate} from 'react-router-dom';

export default function LoadingPage() {
    const navigate = useNavigate();

    // State types are inferred automatically by React, so this is fine:
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>("Initializing System...");
    const [eta, setEta] = useState<number>(15);
    const [details, setDetails] = useState<string>("Connecting to backend...");
    // Phase 2.1.3: Dynamic Status Messages based on operation phase
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                // If we reach 100%, clear timer
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }

                // Non-linear progress simulation (starts fast, slows down)
                const increment = Math.random() * 5;
                const newProgress = Math.min(oldProgress + increment, 99); // Stop at 99 until real confirmation

                // Update messages based on percentage
                if (newProgress < 30) {
                    setStatusMessage("Loading AI Models...");
                    setDetails("Initializing PyTorch & SentenceTransformers");
                } else if (newProgress < 60) {
                    setStatusMessage("Verifying Dataset...");
                    setDetails("Checking integrity of 1,000 papers");
                } else if (newProgress < 90) {
                    setStatusMessage("Warming up Vector Index...");
                    setDetails("Optimizing FAISS/Numpy matrix operations");
                } else {
                    setStatusMessage("Finalizing Setup...");
                    setDetails("Establishing secure connection");
                }

                // Update ETA (Simple calculation)
                setEta((prev) => Math.max(0, prev - 0.5));

                return newProgress;
            });
        }, 500);

        // --- REAL SYSTEM CHECK ---
        // Poll the /health endpoint we built in Backend Phase 2.1.3
        const healthCheck = setInterval(async () => {
            try {
                const response = await apiClient.get('/health');
                // If AI is ready, jump to 100% and redirect
                if (response.data.ai_engine_status === 'ready') {
                    setProgress(100);
                    setStatusMessage("System Ready");
                    setDetails("Redirecting to search...");
                    clearInterval(timer);
                    clearInterval(healthCheck);

                    // Small delay so user sees 100%
                    setTimeout(() => navigate('/'), 1000);
                }
            } catch (error) {
                console.log("Waiting for server...");
            }
        }, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(healthCheck);
        };
    }, [navigate]);

    return (
        <div
            className="min-h-screen bg-light dark:bg-dark-bg flex flex-col items-center justify-center p-4 transition-colors duration-300">

            {/* Phase 2.1.1: Animated Spinner Component with Branding */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div
                    className="relative bg-white dark:bg-dark-surface p-6 rounded-full shadow-xl border border-gray-100 dark:border-gray-700">
                    <Brain className="w-16 h-16 text-primary animate-pulse"/>
                </div>
                {/* Orbital Spinner */}
                <div
                    className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"
                    style={{width: '100%', height: '100%', padding: '-10px'}}></div>
            </div>

            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-secondary dark:text-primary mb-2">
                    {statusMessage}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm h-6">
                    {details}
                </p>

                {/* Phase 2.1.2: Progress Bar with Percentage */}
                <div className="relative pt-1 mb-2">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span
                                className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                                System Status
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-primary">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                            style={{width: `${progress}%`}}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500 ease-out"
                        ></div>
                    </div>
                </div>

                {/* Phase 2.1.3: Estimated Time Remaining */}
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Resource Usage: Optimized</span>
                    <span>Est. Time: {Math.ceil(eta)}s</span>
                </div>

                {/* System Stats Icons (Visual Flair) */}
                <div className="flex justify-center gap-8 mt-12 opacity-50">
                    <div
                        className={`flex flex-col items-center gap-2 ${progress > 30 ? 'text-success' : 'text-gray-400'}`}>
                        <Server size={20}/>
                        <span className="text-xs">Server</span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-2 ${progress > 60 ? 'text-success' : 'text-gray-400'}`}>
                        <Database size={20}/>
                        <span className="text-xs">Data</span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-2 ${progress > 90 ? 'text-success' : 'text-gray-400'}`}>
                        <CheckCircle2 size={20}/>
                        <span className="text-xs">Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}