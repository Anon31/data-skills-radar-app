import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { adminGuard } from './admin-guard';
import { PermissionService } from '../services/permission.service';
import { ToasterService } from '../services/toaster.service';

describe('adminGuard', () => {
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };
    let toasterSpy: { error: ReturnType<typeof vi.fn> };
    let canConfigureMock: WritableSignal<boolean>;

    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = {} as RouterStateSnapshot;

    beforeEach(() => {
        canConfigureMock = signal<boolean>(false);
        routerSpy = { navigate: vi.fn() };
        toasterSpy = { error: vi.fn() };

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: PermissionService,
                    useValue: {
                        canConfigureDataStack: canConfigureMock,
                    },
                },
                { provide: Router, useValue: routerSpy },
                { provide: ToasterService, useValue: toasterSpy },
            ],
        });
    });

    it('doit autoriser la navigation lorsque l’utilisateur possède les droits de configuration admin', () => {
        canConfigureMock.set(true);

        const result = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));

        expect(result).toBe(true);
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        expect(toasterSpy.error).not.toHaveBeenCalled();
    });

    it('doit bloquer la navigation, afficher un toast et rediriger vers /tableau-de-bord sans les droits admin', () => {
        canConfigureMock.set(false);

        const result = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));

        expect(result).toBe(false);
        expect(toasterSpy.error).toHaveBeenCalledWith(
            'Accès restreint',
            "Vous n'avez pas les droits d'administration nécessaires pour accéder à cette zone.",
        );
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tableau-de-bord']);
    });
});
