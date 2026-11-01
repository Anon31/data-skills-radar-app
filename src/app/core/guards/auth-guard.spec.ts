import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { authGuard } from './auth-guard';
import { AuthService } from '../../features/auth/services/auth.service';
import { ToasterService } from '../services/toaster.service';
import { IAuthUser } from '../../features/auth/models/login.model';

describe('authGuard', () => {
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };
    let toasterSpy: { error: ReturnType<typeof vi.fn> };
    let userConnectedMock: WritableSignal<IAuthUser | null>;

    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = {} as RouterStateSnapshot;

    beforeEach(() => {
        userConnectedMock = signal<IAuthUser | null>(null);
        routerSpy = { navigate: vi.fn() };
        toasterSpy = { error: vi.fn() };

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        userConnected: userConnectedMock,
                    },
                },
                { provide: Router, useValue: routerSpy },
                { provide: ToasterService, useValue: toasterSpy },
            ],
        });
    });

    it('doit autoriser l’activation de la route quand l’utilisateur est connecté', () => {
        userConnectedMock.set({
            id: '1',
            email: 'user@dsr.fr',
            firstname: 'John',
            lastname: 'Doe',
            role: 'USER',
        });

        const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

        expect(result).toBe(true);
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        expect(toasterSpy.error).not.toHaveBeenCalled();
    });

    it('doit refuser l’activation, afficher un toast d’erreur et rediriger vers /connexion si l’utilisateur est null', () => {
        userConnectedMock.set(null);

        const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

        expect(result).toBe(false);
        expect(toasterSpy.error).toHaveBeenCalledWith('Accès refusé', "Veuillez vous connecter pour accéder à l'application.");
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/connexion']);
    });
});
