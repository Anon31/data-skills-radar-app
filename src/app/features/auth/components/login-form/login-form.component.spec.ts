import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ILoginDto } from '../../models/login.model';

describe('LoginFormComponent', () => {
    let component: LoginFormComponent;
    let fixture: ComponentFixture<LoginFormComponent>;
    let authServiceSpy: { login: ReturnType<typeof vi.fn> };
    let toasterServiceSpy: { error: ReturnType<typeof vi.fn>; success: ReturnType<typeof vi.fn> };
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        authServiceSpy = { login: vi.fn() };
        toasterServiceSpy = { error: vi.fn(), success: vi.fn() };
        routerSpy = { navigate: vi.fn().mockResolvedValue(true) };

        await TestBed.configureTestingModule({
            imports: [LoginFormComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToasterService, useValue: toasterServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher un toast d’erreur et bloquer l’appel à authService si les champs sont vides', () => {
        component.email.set('');
        component.password.set('');

        component.submitForm();

        expect(toasterServiceSpy.error).toHaveBeenCalledWith('Erreur', 'Veuillez remplir tous les champs.');
        expect(authServiceSpy.login).not.toHaveBeenCalled();

        component.email.set('user@example.com');
        component.password.set('');
        component.submitForm();

        expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('doit appeler authService.login, naviguer vers le tableau de bord et afficher le toast de bienvenue en cas de succès', async () => {
        component.email.set('user@example.com');
        component.password.set('valid-password');

        const mockLoginDto: ILoginDto = {
            access_token: 'fake-jwt',
            message: 'OK',
            user: {
                id: '1',
                email: 'user@example.com',
                firstname: 'Ada',
                lastname: 'Lovelace',
                role: 'USER',
            },
        };

        const httpResponse = new HttpResponse<ILoginDto>({ body: mockLoginDto, status: 200 });
        authServiceSpy.login.mockReturnValue(of(httpResponse));

        component.submitForm();

        expect(authServiceSpy.login).toHaveBeenCalledWith({
            email: 'user@example.com',
            password: 'valid-password',
        });

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tableau-de-bord']);
        await Promise.resolve();

        expect(toasterServiceSpy.success).toHaveBeenCalledWith('Bonjour Ada.', '🌿 Bienvenue dans votre application.');
    });

    it('doit afficher un toast d’erreur si l’appel authService.login échoue', () => {
        component.email.set('user@example.com');
        component.password.set('wrong-password');

        authServiceSpy.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));

        component.submitForm();

        expect(authServiceSpy.login).toHaveBeenCalled();
        expect(toasterServiceSpy.error).toHaveBeenCalledWith('💥 Accès refusé', '🐞 Vérifiez vos informations.');
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
});
