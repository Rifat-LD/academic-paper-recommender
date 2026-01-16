import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Key, ArrowRight, ArrowLeft, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [username, setUsername] = useState('');
    const [securityData, setSecurityData] = useState({
        question: '',
        answer: '',
        newPassword: ''
    });

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);

    // Step 1: Check if user exists & get question
    const handleFindAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // REAL API CALL
            const response = await apiClient.post('/auth/get-question', { username });

            setSecurityData(prev => ({
                ...prev,
                question: response.data.security_question
            }));
            setStep(2); // Only move to step 2 if backend returns success
        } catch (err: any) {
            // If user not found (404)
            setError(err.response?.data?.detail || "Account not found.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // REAL API CALL
            await apiClient.post('/auth/reset-password', {
                username: username,
                security_answer: securityData.answer,
                new_password: securityData.newPassword
            });

            alert("Password reset successfully. Please login.");
            navigate('/login');
        } catch (err: any) {
            // If answer is wrong (400)
            setError(err.response?.data?.detail || "Incorrect security answer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-light dark:bg-dark-bg transition-colors duration-300 py-20 p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">

                <div className="p-8 pb-0">
                    <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2">
                        {step === 1 ? 'Find Your Account' : 'Reset Password'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {step === 1
                            ? 'Enter your username to begin the recovery process.'
                            : 'Answer your security question to set a new password.'}
                    </p>
                </div>

                <div className="p-8 pt-6">
                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    {/* Step 1 Form */}
                    {step === 1 && (
                        <form onSubmit={handleFindAccount} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Find Account <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    )}

                    {/* Step 2 Form */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Security Question</p>
                                    <p className="text-dark dark:text-light font-medium">{securityData.question}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Answer</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light"
                                    placeholder="Enter answer"
                                    value={securityData.answer}
                                    onChange={(e) => setSecurityData({...securityData, answer: e.target.value})}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light"
                                        placeholder="Enter new password"
                                        value={securityData.newPassword}
                                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</>
                                ) : (
                                    <><CheckCircle2 className="w-4 h-4" /> Reset Password</>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => step === 2 ? setStep(1) : navigate('/login')}
                            className="text-sm text-gray-500 hover:text-primary transition-colors inline-flex items-center gap-1 cursor-pointer bg-transparent border-none"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            {step === 2 ? 'Back to Username' : 'Back to Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}