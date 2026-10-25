import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { DOCUMENT } from '@angular/common';
describe('SessionService', () => {
    let service: SessionService;
    let mockDocument: Document;

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

    it('doit vider le sessionStorage tout en préservant les préférences de thème et de sidebar dans localStorage', () => {
        if (!service.isDarkMode()) {
            service.toggleTheme();
        }
        if (!service.isSidebarOpen()) {
            service.toggleSidebar();
        }
        TestBed.flushEffects();

        sessionStorage.setItem('dsr_temp_data', 'some-value');
        expect(sessionStorage.getItem('dsr_temp_data')).toBe('some-value');

        service.clearSession();

        expect(sessionStorage.getItem('dsr_temp_data')).toBeNull();
        expect(localStorage.getItem('dsr_dark_mode')).toBe('true');
        expect(localStorage.getItem('dsr_sidebar_open')).toBe('true');
    });
});
