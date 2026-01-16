import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ShieldQuestion, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/client'; // <--- Import API Client
import PasswordInput from '../components/ui/PasswordInput';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        securityQuestion: '',
        securityAnswer: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Prepare data for the Backend Schema (UserCreate)
        const payload = {
            username: formData.username,
            password: formData.password,
            security_question: formData.securityQuestion,
            security_answer: formData.securityAnswer
        };

        try {
            // Call Backend
            await apiClient.post('/auth/register', {
                username: formData.username,
                password: formData.password,
                security_question: formData.securityQuestion,
                security_answer: formData.securityAnswer
            });

            // Show Success State
            setSuccess(true);
            setIsLoading(false);

            // Auto Redirect after 1.5 seconds
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err: any) {
            console.error(err);
            // Handle duplicate username error (400)
            if (err.response?.status === 400) {
                setError(err.response.data.detail || "Username already exists.");
            } else {
                setError("Registration failed. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const securityQuestions = [
        "What was the name of your first pet?",
        "What is your mother's maiden name?",
        "In what city were you born?",
        "What was the model of your first car?",
        "What is the name of your favorite teacher?"
    ];

    return (
        <div className="flex items-center justify-center bg-light dark:bg-dark-bg transition-colors duration-300 py-20 p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">

                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2">Create Account</h2>
                    <p className="text-gray-500 text-sm">Join to start your semantic research journey.</p>
                </div>

                <div className="p-8 pt-2">
                    {success && (
                        <div className="mb-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-semibold">Account created! Redirecting...</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <PasswordInput
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Create a strong password"
                            />
                        </div>

                        {/* Security Section Header */}
                        <div className="pt-2 pb-1 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Offline Recovery Setup
                            </h3>
                        </div>

                        {/* Security Question */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Question</label>
                            <div className="relative">
                                <ShieldQuestion className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light appearance-none cursor-pointer"
                                    value={formData.securityQuestion}
                                    onChange={(e) => setFormData({...formData, securityQuestion: e.target.value})}
                                >
                                    <option value="" disabled>Select a question...</option>
                                    {securityQuestions.map((q, i) => (
                                        <option key={i} value={q}>{q}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Security Answer */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Answer</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light"
                                placeholder="Your answer (case sensitive)"
                                value={formData.securityAnswer}
                                onChange={(e) => setFormData({...formData, securityAnswer: e.target.value})}
                            />
                        </div>

                        {/* Error Message Display */}
                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors inline-flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}