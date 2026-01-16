import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

export default function PasswordInput({
                                          value,
                                          onChange,
                                          placeholder = "Enter password",
                                          required = true
                                      }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            {/* Lock Icon (Left) */}
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
                type={showPassword ? "text" : "password"}
                required={required}
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-dark dark:text-light"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

            {/* Toggle Button (Right) */}
            <button
                type="button" // Important: type="button" prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}