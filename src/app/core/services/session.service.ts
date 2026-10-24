import { Injectable, signal, effect, Inject, WritableSignal, Signal } from '@angular/core';
import { IUserDto } from '../../features/users/models/user.model';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly KEYS = {
        DARK_MODE: 'dsr_dark_mode', // Sera stocké en LocalStorage
        SIDEBAR_OPEN: 'dsr_sidebar_open', // Sera stocké en LocalStorage
        CURRENT_USER: 'dsr_current_user', // Sera stocké en SessionStorage
    } as const;

    // --- SIGNALS INTERNES ---
    private readonly _isDarkMode: WritableSignal<boolean>;
    private readonly _isSidebarOpen: WritableSignal<boolean>;
    private readonly _currentUser: WritableSignal<IUserDto | null>;

    public readonly isDarkMode: Signal<boolean>;
    public readonly isSidebarOpen: Signal<boolean>;
    public readonly currentUser: Signal<IUserDto | null>;

    constructor(@Inject(DOCUMENT) private readonly document: Document) {
        this._isDarkMode = signal<boolean>(this.getBooleanFromStorage(localStorage, this.KEYS.DARK_MODE, this.prefersDarkMode()));
        this._isSidebarOpen = signal<boolean>(this.getBooleanFromStorage(localStorage, this.KEYS.SIDEBAR_OPEN, true));
        this._currentUser = signal<IUserDto | null>(this.getObjectFromStorage<IUserDto>(sessionStorage, this.KEYS.CURRENT_USER, null));

        this.isDarkMode = this._isDarkMode.asReadonly();
        this.isSidebarOpen = this._isSidebarOpen.asReadonly();
        this.currentUser = this._currentUser.asReadonly();

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

        // Effect : Synchronisation de l'Utilisateur (SessionStorage)
        effect(() => {
            const user = this._currentUser();
            if (user) {
                sessionStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
            } else {
                sessionStorage.removeItem(this.KEYS.CURRENT_USER);
            }
        });
    }

    // --- ACTIONS ---
    public toggleTheme(): void {
        this._isDarkMode.update((v) => !v);
    }

    public toggleSidebar(): void {
        this._isSidebarOpen.update((v) => !v);
    }

    public setCurrentUser(user: IUserDto): void {
        this._currentUser.set(user);
    }

    public clearCurrentUser(): void {
        this._currentUser.set(null);
    }

    public clearSession(): void {
        this._currentUser.set(null);
        // On ne vide QUE le sessionStorage. Les préférences de thème (localStorage) sont conservées !
        sessionStorage.clear();
    }

    // --- LECTURE SÉCURISÉE ---
    // Ajout du paramètre "storage" pour choisir entre localStorage et sessionStorage
    private getBooleanFromStorage(storage: Storage, key: string, defaultValue: boolean): boolean {
        try {
            const item = storage.getItem(key);
            return item !== null ? (JSON.parse(item) as boolean) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    private getObjectFromStorage<T>(storage: Storage, key: string, defaultValue: T | null): T | null {
        try {
            const item = storage.getItem(key);
            return item !== null ? (JSON.parse(item) as T) : defaultValue;
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
