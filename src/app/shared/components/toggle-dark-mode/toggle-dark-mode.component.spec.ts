import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { ToggleDarkModeComponent } from './toggle-dark-mode.component';
import { SessionService } from '../../../core/services/session.service';

describe('ToggleDarkModeComponent', () => {
    let component: ToggleDarkModeComponent;
    let fixture: ComponentFixture<ToggleDarkModeComponent>;
    let isDarkModeMock: WritableSignal<boolean>;
    let sessionServiceMock: {
        isDarkMode: WritableSignal<boolean>;
        toggleTheme: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        isDarkModeMock = signal<boolean>(false);
        sessionServiceMock = {
            isDarkMode: isDarkModeMock,
            toggleTheme: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [ToggleDarkModeComponent],
            providers: [{ provide: SessionService, useValue: sessionServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(ToggleDarkModeComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher l’icône "dark_mode" quand isDarkMode vaut false', () => {
        fixture.detectChanges();
        const icon = fixture.nativeElement.querySelector('.material-symbols-outlined') as HTMLElement;
        expect(icon.textContent?.trim()).toBe('dark_mode');
    });

    it('doit afficher l’icône "light_mode" quand isDarkMode vaut true', () => {
        isDarkModeMock.set(true);
        fixture.detectChanges();

        const icon = fixture.nativeElement.querySelector('.material-symbols-outlined') as HTMLElement;
        expect(icon.textContent?.trim()).toBe('light_mode');
    });

    it('doit déclencher sessionService.toggleTheme() lors du clic sur le bouton', () => {
        const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        button.click();

        expect(sessionServiceMock.toggleTheme).toHaveBeenCalledTimes(1);
    });
});
