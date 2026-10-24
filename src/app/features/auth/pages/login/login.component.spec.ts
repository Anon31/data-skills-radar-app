import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToasterService } from '../../../../core/services/toaster.service';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        routerSpy = { navigate: vi.fn() };

        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: AuthService, useValue: { login: vi.fn() } },
                { provide: ToasterService, useValue: { error: vi.fn(), success: vi.fn() } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit initialiser le signal showLoginForm à false', () => {
        expect(component.showLoginForm()).toBe(false);
    });

    it('doit basculer la valeur de showLoginForm lors d’un appel à toggleForm()', () => {
        component.toggleForm();
        expect(component.showLoginForm()).toBe(true);

        component.toggleForm();
        expect(component.showLoginForm()).toBe(false);
    });

    it('doit naviguer vers /tableau-de-bord lors d’un appel à visitAsGuest()', () => {
        component.visitAsGuest();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tableau-de-bord']);
    });
});
