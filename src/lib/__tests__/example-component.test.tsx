import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@/test/test-utils';
import {Button} from '@/components/ui/button';

// Example component test
describe('Example Component Tests', () => {
    it('should render a button with correct text', () => {
        render (
            <Button>Click me</Button>
        );

        expect(screen.getByRole('button', {name: /click me/i})).toBeInTheDocument();
    });

    it('should handle click events', async () => {
        const handleClick = vi.fn();
        render (
            <Button onClick={handleClick}>Click me</Button>
        );

        const button = screen.getByRole('button', {name: /click me/i});
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render (
            <Button disabled>Click me</Button>
        );

        const button = screen.getByRole('button', {name: /click me/i});
        expect(button).toBeDisabled();
    });

    it('should apply custom className', () => {
        render (
            <Button className="custom-class">Click me</Button>
        );

        const button = screen.getByRole('button', {name: /click me/i});
        expect(button).toHaveClass('custom-class');
    });
});

// Example async test
describe('Async Operations', () => {
    it('should handle async operations', async () => {
        const mockAsyncFunction = vi.fn().mockResolvedValue('success');

        const result = await mockAsyncFunction();

        expect(result).toBe('success');
        expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
    });

    it('should handle API calls', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(
                {data: 'test'}
            )
        });

        global.fetch = mockFetch;

        const response = await fetch('/api/test');
        const data = await response.json();

        expect(data).toEqual({data: 'test'});
        expect(mockFetch).toHaveBeenCalledWith('/api/test');
    });
});

// Example form test
describe('Form Testing', () => {
    it('should handle form submission', async () => {
        const handleSubmit = vi.fn();

        render (
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" defaultValue="testuser"/>
                <button type="submit">Submit</button>
            </form>
        );

        const submitButton = screen.getByRole('button', {name: /submit/i});
        fireEvent.click(submitButton);

        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should validate form inputs', async () => {
        render (
            <form>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required/>
                <button type="submit">Submit</button>
            </form>
        );

        const emailInput = screen.getByRole('textbox', {name: /email/i});
        const submitButton = screen.getByRole('button', {name: /submit/i});

        // Test invalid email
        fireEvent.change(emailInput, {
            target: {
                value: 'invalid-email'
            }
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(emailInput).toBeInvalid();
        });

        // Test valid email
        fireEvent.change(emailInput, {
            target: {
                value: 'test@example.com'
            }
        });

        await waitFor(() => {
            expect(emailInput).toBeValid();
        });
    });
});
