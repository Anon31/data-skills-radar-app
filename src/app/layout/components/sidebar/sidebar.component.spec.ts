import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { IAuthUser } from '../../../features/auth/models/login.model';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async () => {
        sessionStorage.clear();

        await TestBed.configureTestingModule({
            imports: [SidebarComponent],
            providers: [
                provideRouter([]),
                {
                    provide: AuthService,
                    useValue: {
                        userConnected: signal<IAuthUser | null>(null),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit basculer le signal isOpen et le synchroniser dans sessionStorage', () => {
        const initial = component.isOpen();
        component.toggle();
        expect(component.isOpen()).toBe(!initial);

        TestBed.flushEffects();
        expect(sessionStorage.getItem('dsr_sidebar_state')).toBe(String(!initial));
    });

    it('doit appliquer la classe w-64 lorsqu’elle est ouverte et w-20 lorsqu’elle est fermée', () => {
        component.isOpen.set(true);
        fixture.detectChanges();
        const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;
        expect(aside.classList.contains('w-64')).toBe(true);
        expect(aside.classList.contains('w-20')).toBe(false);

        component.isOpen.set(false);
        fixture.detectChanges();
        expect(aside.classList.contains('w-20')).toBe(true);
        expect(aside.classList.contains('w-64')).toBe(false);
    });
});
