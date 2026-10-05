import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const DsrTheme = definePreset(Aura, {
    semantic: {
        colorScheme: {
            // ☀️ MODE CLAIR : Fonds Blanc/Gris + Primaire TEAL (Cyan)
            light: {
                primary: {
                    50: '{teal.50}',
                    100: '{teal.100}',
                    200: '{teal.200}',
                    300: '{teal.300}',
                    400: '{teal.400}',
                    500: '{teal.500}',
                    600: '{teal.600}',
                    700: '{teal.700}',
                    800: '{teal.800}',
                    900: '{teal.900}',
                    950: '{teal.950}',
                    color: '{teal.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{teal.600}',
                    activeColor: '{teal.700}',
                },
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}',
                }
            },
            // 🌙 MODE SOMBRE : Fonds Bleu Nuit + Primaire AMBER (Orange)
            dark: {
                primary: {
                    50: '{amber.50}',
                    100: '{amber.100}',
                    200: '{amber.200}',
                    300: '{amber.300}',
                    400: '{amber.400}',
                    500: '{amber.500}',
                    600: '{amber.600}',
                    700: '{amber.700}',
                    800: '{amber.800}',
                    900: '{amber.900}',
                    950: '{amber.950}',
                    color: '{amber.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{amber.400}',
                    activeColor: '{amber.600}',
                },
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}',
                }
            }
        }
    },
    components: {
        toast: {
            root: {
                width: '24rem',
                borderRadius: '12px',
                borderWidth: '1px',
                transitionDuration: '0.4s',
            },
            colorScheme: {
                light: {
                    success: { background: 'rgba(209, 250, 229, 0.95)', color: '#047857', detailColor: '#065f46', borderColor: 'rgba(16, 185, 129, 0.5)', shadow: '0 8px 30px rgba(16, 185, 129, 0.2)' },
                    info: { background: 'rgba(219, 234, 254, 0.95)', color: '#1e40af', detailColor: '#1e3a8a', borderColor: 'rgba(59, 130, 246, 0.5)', shadow: '0 8px 30px rgba(59, 130, 246, 0.2)' },
                    warn: { background: 'rgba(255, 237, 213, 0.95)', color: '#9a3412', detailColor: '#7c2d12', borderColor: 'rgba(249, 115, 22, 0.5)', shadow: '0 8px 30px rgba(249, 115, 22, 0.2)' },
                    error: { background: 'rgba(254, 226, 226, 0.95)', color: '#991b1b', detailColor: '#7f1d1d', borderColor: 'rgba(239, 68, 68, 0.5)', shadow: '0 8px 30px rgba(239, 68, 68, 0.2)' },
                },
                dark: {
                    success: { background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.2) 0%, rgba(2, 44, 34, 0.6) 100%)', color: '#a7f3d0', detailColor: '#6ee7b7', borderColor: 'rgba(52, 211, 153, 0.8)', shadow: '0 4px 30px rgba(16, 185, 129, 0.35)' },
                    info: { background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 58, 138, 0.4) 100%)', color: '#dbeafe', detailColor: '#bfdbfe', borderColor: 'rgba(96, 165, 250, 0.6)', shadow: '0 4px 25px rgba(59, 130, 246, 0.25)' },
                    warn: { background: 'linear-gradient(145deg, rgba(249, 115, 22, 0.15) 0%, rgba(124, 45, 18, 0.4) 100%)', color: '#ffedd5', detailColor: '#fed7aa', borderColor: 'rgba(251, 146, 60, 0.6)', shadow: '0 4px 25px rgba(249, 115, 22, 0.25)' },
                    error: { background: 'linear-gradient(145deg, rgba(225, 29, 72, 0.2) 0%, rgba(76, 5, 25, 0.6) 100%)', color: '#ffe4e6', detailColor: '#fda4af', borderColor: 'rgba(251, 113, 133, 0.8)', shadow: '0 4px 30px rgba(225, 29, 72, 0.35)' },
                },
            },
        }
    }
});

export default DsrTheme;
