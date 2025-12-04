// src/components/ui/Button.test.jsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

// A "test suite" for our Button component
describe('Button Component', () => {

    // A single "test case"
    it('should render with the correct text', () => {
        // 1. Arrange: Render the component with some text
        render(<Button>Click Me</Button>);

        // 2. Act: (No action needed for this simple test)

        // 3. Assert: Check if the button with the text "Click Me" exists in the document
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
    });

});