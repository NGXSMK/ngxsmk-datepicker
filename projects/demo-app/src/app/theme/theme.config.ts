import { ThemeConfig } from '@tokiforge/core';

const baseTokens = {
    font: {
        family: {
            main: { value: "'Outfit', 'Inter', sans-serif" },
            code: { value: "'Fira Code', 'Cascadia Code', monospace" }
        }
    },
    spacing: {
        xs: { value: '0.25rem', type: 'dimension' as const },
        sm: { value: '0.5rem', type: 'dimension' as const },
        md: { value: '1rem', type: 'dimension' as const },
        lg: { value: '1.5rem', type: 'dimension' as const },
        xl: { value: '2rem', type: 'dimension' as const }
    },
    radius: {
        sm: { value: '6px', type: 'dimension' as const },
        md: { value: '10px', type: 'dimension' as const },
        lg: { value: '14px', type: 'dimension' as const },
        full: { value: '9999px', type: 'dimension' as const }
    }
};

export const themeConfig: ThemeConfig = {
    themes: [
        {
            name: 'dark',
            tokens: {
                ...baseTokens,
                color: {
                    primary: { value: 'hsl(262, 83%, 58%)', type: 'color' },
                    'primary-light': { value: 'hsl(262, 83%, 68%)', type: 'color' },
                    'primary-dark': { value: 'hsl(262, 83%, 48%)', type: 'color' },
                    secondary: { value: 'hsl(195, 100%, 50%)', type: 'color' },
                    success: { value: 'hsl(142, 70%, 50%)', type: 'color' },
                    error: { value: 'hsl(0, 84%, 60%)', type: 'color' },
                    bg: {
                        page: { value: 'hsl(240, 10%, 4%)', type: 'color' },
                        sidebar: { value: 'hsl(240, 10%, 6%)', type: 'color' },
                        secondary: { value: 'hsl(240, 8%, 8%)', type: 'color' },
                        card: { value: 'hsl(240, 8%, 10%)', type: 'color' },
                        elevated: { value: 'hsl(240, 6%, 15%)', type: 'color' },
                        code: { value: 'hsl(240, 8%, 2%)', type: 'color' },
                        header: { value: 'hsla(240, 10%, 4%, 0.85)', type: 'color' }
                    },
                    text: {
                        main: { value: 'hsl(0, 0%, 98%)', type: 'color' },
                        muted: { value: 'hsl(0, 0%, 75%)', type: 'color' },
                        dim: { value: 'hsl(0, 0%, 55%)', type: 'color' },
                        tertiary: { value: 'hsl(0, 0%, 40%)', type: 'color' }
                    },
                    border: {
                        DEFAULT: { value: 'hsla(0, 0%, 100%, 0.08)', type: 'color' },
                        light: { value: 'hsla(0, 0%, 100%, 0.15)', type: 'color' }
                    }
                },
                shadow: {
                    sm: { value: '0 2px 4px rgba(0, 0, 0, 0.4)', type: 'shadow' },
                    md: { value: '0 8px 16px -4px rgba(0, 0, 0, 0.5)', type: 'shadow' },
                    lg: { value: '0 20px 40px -12px rgba(0, 0, 0, 0.7)', type: 'shadow' }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
        },
        {
            name: 'light',
            tokens: {
                ...baseTokens,
                color: {
                    primary: { value: 'hsl(262, 83%, 58%)' },
                    'primary-light': { value: 'hsl(262, 83%, 68%)' },
                    'primary-dark': { value: 'hsl(262, 83%, 48%)' },
                    secondary: { value: 'hsl(195, 100%, 50%)' },
                    success: { value: 'hsl(142, 70%, 50%)' },
                    error: { value: 'hsl(0, 84%, 60%)' },
                    bg: {
                        page: { value: 'hsl(240, 10%, 98%)' },
                        sidebar: { value: 'hsl(240, 10%, 94%)' },
                        secondary: { value: 'hsl(240, 8%, 92%)' },
                        card: { value: 'hsl(0, 0%, 100%)' },
                        elevated: { value: 'hsl(240, 6%, 88%)' },
                        code: { value: 'hsl(240, 8%, 96%)' },
                        header: { value: 'hsla(240, 10%, 98%, 0.85)' }
                    },
                    text: {
                        main: { value: 'hsl(240, 10%, 4%)' },
                        muted: { value: 'hsl(240, 10%, 25%)' },
                        dim: { value: 'hsl(240, 10%, 45%)' },
                        tertiary: { value: 'hsl(240, 10%, 60%)' }
                    },
                    border: {
                        DEFAULT: { value: 'hsla(0, 0%, 0%, 0.08)' },
                        light: { value: 'hsla(0, 0%, 0%, 0.15)' }
                    }
                },
                shadow: {
                    sm: { value: '0 2px 4px rgba(0, 0, 0, 0.1)' },
                    md: { value: '0 8px 16px -4px rgba(0, 0, 0, 0.15)' },
                    lg: { value: '0 20px 40px -12px rgba(0, 0, 0, 0.2)' }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
        }
    ],
    defaultTheme: 'dark'
};
