import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { DOCUMENT } from '@angular/common';
import { IUserDto } from '../../features/users/models/user.model';

describe('SessionService', () => {
    let service: SessionService;
    let mockDocument: Document;

    const mockUser: IUserDto = {
        id: 'user-123',
        firstname: 'Thomas',
        lastname: 'Pesquet',
        email: 'thomas@esa.int',
        birthdate: '1978-01-13',
        enabled: true,
        role: 'USER',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    };

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();

        TestBed.configureTestingModule({
            providers: [SessionService],
        });

        service = TestBed.inject(SessionService);
        mockDocument = TestBed.inject(DOCUMENT);
    });

    afterEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it('doit être correctement instancié', () => {
        expect(service).toBeTruthy();
    });

    it('doit basculer le thème, mettre à jour le localStorage et les classes du document', () => {
        const initialDark = service.isDarkMode();
        service.toggleTheme();

        expect(service.isDarkMode()).toBe(!initialDark);
        TestBed.flushEffects();

        expect(localStorage.getItem('dsr_dark_mode')).toBe(JSON.stringify(!initialDark));

        if (!initialDark) {
            expect(mockDocument.documentElement.classList.contains('dark')).toBe(true);
        } else {
            expect(mockDocument.documentElement.classList.contains('dark')).toBe(false);
        }
    });

    it('doit basculer l’état de la barre latérale et mettre à jour le localStorage', () => {
        const initialSidebar = service.isSidebarOpen();
        service.toggleSidebar();

        expect(service.isSidebarOpen()).toBe(!initialSidebar);
        TestBed.flushEffects();

        expect(localStorage.getItem('dsr_sidebar_open')).toBe(JSON.stringify(!initialSidebar));
    });

    it('doit définir l’utilisateur courant et le synchroniser dans sessionStorage', () => {
        expect(service.currentUser()).toBeNull();

        service.setCurrentUser(mockUser);
        expect(service.currentUser()).toEqual(mockUser);

        TestBed.flushEffects();
        expect(sessionStorage.getItem('dsr_current_user')).toBe(JSON.stringify(mockUser));
    });

    it('doit effacer l’utilisateur courant et le supprimer de sessionStorage', () => {
        service.setCurrentUser(mockUser);
        TestBed.flushEffects();
        expect(sessionStorage.getItem('dsr_current_user')).not.toBeNull();

        service.clearCurrentUser();
        expect(service.currentUser()).toBeNull();

        TestBed.flushEffects();
        expect(sessionStorage.getItem('dsr_current_user')).toBeNull();
    });

    it('doit vider la session tout en préservant la préférence de thème dans localStorage', () => {
        if (!service.isDarkMode()) {
            service.toggleTheme();
        }
        service.setCurrentUser(mockUser);
        TestBed.flushEffects();

        expect(localStorage.getItem('dsr_dark_mode')).toBe('true');

        service.clearSession();
        expect(service.currentUser()).toBeNull();
        expect(sessionStorage.getItem('dsr_current_user')).toBeNull();
        expect(localStorage.getItem('dsr_dark_mode')).toBe('true');
    });
});
