import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// This ensures a clean DOM for every test, preventing weird side effects.
afterEach(() => {
    cleanup();
});