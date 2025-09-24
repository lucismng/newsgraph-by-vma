import React from 'react';
import { UIProvider } from './UIContext';
import { NewsProvider } from './NewsContext';

// This is now a "Composer" Provider. It combines other, more specialized
// providers into a single, clean provider for App.tsx. This avoids
// "provider hell" in the main App component.
// FIX: Using React.PropsWithChildren to correctly type components that accept children.
// This resolves an issue where TypeScript failed to recognize children passed via JSX.
export const AppProvider = ({ children }: React.PropsWithChildren<{}>) => {
    return (
        <UIProvider>
            <NewsProvider>
                {children}
            </NewsProvider>
        </UIProvider>
    );
};
