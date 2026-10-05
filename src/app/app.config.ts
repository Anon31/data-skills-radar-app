import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DsrTheme } from '../styles/theme/dsr-theme';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        providePrimeNG({
            license:
                'eyJpZCI6IjIwY2ZhMzIzLWYyMDYtNDEyNy05M2Q0LWIxZDQ5NGE5ODQ4ZiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTEwNDU4NjAsImV4cCI6MTgyMjU4MTg2MH0.4dLFDSsBCBbxLCoxBT1qkoPX2Z9A0ZDeJKAD7OBwg63VqizkIFE7UW1P2UPwTuwdFajj4dtGO-E8yCa21tiPDw',
            theme: {
                preset: DsrTheme,
                options: {
                    darkModeSelector: '.dark',
                    // Configuration exacte pour Tailwind v4
                    cssLayer: {
                        name: 'primeng',
                        order: 'theme, base, primeng',
                    },
                },
            },
            ripple: true,
        }),
        MessageService,
        DialogService,
        ConfirmationService,
    ],
};
