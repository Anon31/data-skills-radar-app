import { Injectable, signal, effect, Inject, WritableSignal, Signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly KEYS = {
        DARK_MODE: 'dsr_dark_mode', // Stocké en LocalStorage
        SIDEBAR_OPEN: 'dsr_sidebar_open', // Stocké en LocalStorage
    } as const;

    // --- SIGNALS INTERNES ---
    private readonly _isDarkMode: WritableSignal<boolean>;
    private readonly _isSidebarOpen: WritableSignal<boolean>;

    public readonly isDarkMode: Signal<boolean>;
    public readonly isSidebarOpen: Signal<boolean>;

    constructor(@Inject(DOCUMENT) private readonly document: Document) {
        this._isDarkMode = signal<boolean>(this.getBooleanFromStorage(localStorage, this.KEYS.DARK_MODE, this.prefersDarkMode()));
        this._isSidebarOpen = signal<boolean>(this.getBooleanFromStorage(localStorage, this.KEYS.SIDEBAR_OPEN, true));

        this.isDarkMode = this._isDarkMode.asReadonly();
        this.isSidebarOpen = this._isSidebarOpen.asReadonly();

        // Effect : Synchronisation du Thème (LocalStorage)
        effect(() => {
            const isDark = this._isDarkMode();
            localStorage.setItem(this.KEYS.DARK_MODE, JSON.stringify(isDark));

            if (isDark) {
                this.document.documentElement.classList.add('dark');
            } else {
                this.document.documentElement.classList.remove('dark');
            }
        });

        // Effect : Synchronisation de la Sidebar (LocalStorage)
        effect(() => {
            localStorage.setItem(this.KEYS.SIDEBAR_OPEN, JSON.stringify(this._isSidebarOpen()));
        });
    }

    // --- ACTIONS ---
    public toggleTheme(): void {
        this._isDarkMode.update((v) => !v);
    }

    public toggleSidebar(): void {
        this._isSidebarOpen.update((v) => !v);
    }

    public clearSession(): void {
        sessionStorage.clear();
    }

    // --- LECTURE SÉCURISÉE ---
    private getBooleanFromStorage(storage: Storage, key: string, defaultValue: boolean): boolean {
        try {
            const item = storage.getItem(key);
            return item !== null ? (JSON.parse(item) as boolean) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    private prefersDarkMode(): boolean {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    }
}
