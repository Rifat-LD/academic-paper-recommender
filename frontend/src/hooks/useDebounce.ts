import { useState, useEffect } from 'react';

// This hook ensures a value is only updated after a delay
// Great for search inputs to avoid hitting the server on every keystroke
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set a timer to update the value
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timer if value changes (user keeps typing)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}