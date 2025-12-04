// src/components/ui/Button.jsx

import React from 'react';

// A simple presentational button component
export const Button = ({ children, onClick, type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-secondary transition-colors duration-300"
        >
            {children}
        </button>
    );
};