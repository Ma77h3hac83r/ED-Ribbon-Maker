import React from 'react';
import {render, RenderOptions} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// Create a custom render function that includes providers
const AllTheProviders = ({children} : {
    children: React.ReactNode
}) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    });

    return (
        <QueryClientProvider client={queryClient}>
            {children} </QueryClientProvider>
    );
};

const customRender = (ui : React.ReactElement, options? : Omit < RenderOptions, 'wrapper' >) => render(ui, {
    wrapper: AllTheProviders,
    ...options
});

// Re-export everything
export * from '@testing-library/react';

// Override render method
export {
    customRender as render
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
    id: '123',
    name: 'Test Commander',
    email: 'test@example.com',
    inaraId: '456',
    rankCombat: 5,
    rankTrade: 3,
    rankExplorer: 7,
    rankExobiologist: 2,
    rankMercenary: 4,
    rankFederal: 8,
    rankImperial: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
});

export const createMockRibbon = (overrides = {}) => ({
        id: 'ribbon-1',
        type: 'combat' as const,
        level: 5,
        name: 'Combat Elite',
        description: 'Elite combat rank',
        color: '#FF0000',
        backgroundColor: '#000000',
        ...overrides
    });

    export const createMockCommander = (overrides = {}) => ({
        id: 'commander-1',
        name: 'Commander Test',
        inaraId: '12345',
        rankCombat: 5,
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    });

    // Mock API responses
    export const mockApiResponses = {
        success: (data : any) => Promise.resolve(
            {
                ok: true,
                status: 200,
                json: () => Promise.resolve(data)
            }
        ),
        error: (status = 500, message = 'Internal Server Error') => Promise.resolve(
            {
                ok: false,
                status,
                json: () => Promise.resolve(
                    {error: message}
                )
            }
        )
    };

    // Wait for element to be removed
    export const waitForElementToBeRemoved = (element : Element | null) => {
        return new Promise < void > ((resolve) => {
            if (!element) {
                resolve();
                return;
            }

            const observer = new MutationObserver(() => {
                if (!document.contains(element)) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };
