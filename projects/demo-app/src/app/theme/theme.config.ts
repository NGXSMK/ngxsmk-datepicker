import { ThemeConfig } from '@tokiforge/core';

const baseTokens = {
  font: {
    family: {
      main: { value: "'Karla', 'Segoe UI', system-ui, sans-serif" },
      display: { value: "'Oswald', 'Arial Narrow', Impact, sans-serif" },
      code: { value: "'JetBrains Mono', ui-monospace, monospace" },
    },
  },
  spacing: {
    xs: { value: '0.25rem', type: 'dimension' as const },
    sm: { value: '0.5rem', type: 'dimension' as const },
    md: { value: '1rem', type: 'dimension' as const },
    lg: { value: '1.5rem', type: 'dimension' as const },
    xl: { value: '2rem', type: 'dimension' as const },
  },
  radius: {
    sm: { value: '0px', type: 'dimension' as const },
    md: { value: '0px', type: 'dimension' as const },
    lg: { value: '2px', type: 'dimension' as const },
    full: { value: '9999px', type: 'dimension' as const },
  },
};

export const themeConfig: ThemeConfig = {
  themes: [
    {
      name: 'light',
      tokens: {
        ...baseTokens,
        color: {
          primary: { value: '#151920', type: 'color' },
          'primary-light': { value: '#3a4250', type: 'color' },
          'primary-dark': { value: '#0b0e12', type: 'color' },
          secondary: { value: '#ffb703', type: 'color' },
          success: { value: '#2a9d8f', type: 'color' },
          error: { value: '#c1121f', type: 'color' },
          bg: {
            page: { value: '#ebeef3', type: 'color' },
            sidebar: { value: '#e4e8ef', type: 'color' },
            secondary: { value: '#dde2ea', type: 'color' },
            card: { value: '#ffffff', type: 'color' },
            elevated: { value: '#f4f6f9', type: 'color' },
            code: { value: '#12161c', type: 'color' },
            header: { value: '#151920', type: 'color' },
          },
          text: {
            main: { value: '#151920', type: 'color' },
            muted: { value: '#3e4654', type: 'color' },
            dim: { value: '#6b7380', type: 'color' },
            tertiary: { value: '#8b93a0', type: 'color' },
          },
          border: {
            DEFAULT: { value: '#d3d8e0', type: 'color' },
            light: { value: '#b4bcc8', type: 'color' },
          },
        },
        shadow: {
          sm: { value: 'none', type: 'shadow' },
          md: { value: '0 12px 28px -20px rgba(21, 25, 32, 0.45)', type: 'shadow' },
          lg: { value: '0 24px 48px -24px rgba(21, 25, 32, 0.5)', type: 'shadow' },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
    {
      name: 'dark',
      tokens: {
        ...baseTokens,
        color: {
          primary: { value: '#ffb703' },
          'primary-light': { value: '#ffd56a' },
          'primary-dark': { value: '#e09e00' },
          secondary: { value: '#3d5a80' },
          success: { value: '#2a9d8f' },
          error: { value: '#e06b63' },
          bg: {
            page: { value: '#0e1116' },
            sidebar: { value: '#0a0c10' },
            secondary: { value: '#171b22' },
            card: { value: '#171b22' },
            elevated: { value: '#1f2530' },
            code: { value: '#080a0d' },
            header: { value: '#0a0c10' },
          },
          text: {
            main: { value: '#f2f4f7' },
            muted: { value: '#c2c8d2' },
            dim: { value: '#8b93a0' },
            tertiary: { value: '#6b7380' },
          },
          border: {
            DEFAULT: { value: '#2a313c' },
            light: { value: '#3d4656' },
          },
        },
        shadow: {
          sm: { value: 'none' },
          md: { value: '0 12px 32px -16px rgba(0, 0, 0, 0.7)' },
          lg: { value: '0 24px 48px -20px rgba(0, 0, 0, 0.8)' },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
  ],
  defaultTheme: 'light',
};
