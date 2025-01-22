import type {Config} from 'tailwindcss';
import tailwindForms from '@tailwindcss/forms';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                '13': 'repeat(13, minmax(0, 1fr))',
            },
            colors: {
                blue: {
                    400: '#2589FE',
                    500: '#0070F3',
                    600: '#2F6FEB',
                },
            },
        },
        keyframes: {
            shimmer: {
                '100%': {
                    transform: 'translateX(100%)',
                },
            },
            animloader27: {
                '0%, 100%': {transform: 'scale(0)', opacity: '1'},
                '50%': {transform: 'scale(1)', opacity: '0'}
            }
        },
        animation: {
            animloader27: 'animloader27 2s ease-in-out infinite'
        }
    },
    plugins: [
        tailwindForms
    ]
};
export default config;
