import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';
import PasswordInput from '../components/ui/PasswordInput';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuthStore();
    const [error, setError] = useState(''); // Add error state
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            // If logged in, go home immediately
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);

        try {
            // 1. Call Backend
            const response = await apiClient.post('/auth/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // 2. Save Token to Store
            // Note: Our backend returns { access_token, token_type }
            const { access_token } = response.data;

            login(access_token, formData.username);

            // 3. Navigate
            navigate('/');

        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Invalid username or password");
            } else {
                setError("Login failed. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-light dark:bg-dark-bg transition-colors duration-300 py-20 p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">

                {/* Header - Removed Blue Gradient & Reduced Padding */}
                <div className="p-6 pb-2 text-center">
                    <div className="inline-flex items-center justify-center text-primary mb-2">
                        <Brain className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary dark:text-primary">Welcome Back</h2>
                    <p className="text-gray-500 text-sm mt-1">Sign in to access your research library</p>
                </div>

                {/* Form */}
                <div className="p-8 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:text-secondary font-medium transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <PasswordInput
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Enter your password"
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</>
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:text-secondary transition-colors">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}