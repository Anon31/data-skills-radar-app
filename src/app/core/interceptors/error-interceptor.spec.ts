import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { errorInterceptor } from './error-interceptor';
import { ToasterService } from '../services/toaster.service';
import { AuthService } from '../../features/auth/services/auth.service';

describe('errorInterceptor', () => {
    let toasterServiceMock: { error: ReturnType<typeof vi.fn> };
    let authServiceMock: { logout: ReturnType<typeof vi.fn> };

    const executeInterceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => errorInterceptor(req, next));

    beforeEach(() => {
        toasterServiceMock = { error: vi.fn() };
        authServiceMock = { logout: vi.fn() };

        TestBed.configureTestingModule({
            providers: [
                { provide: ToasterService, useValue: toasterServiceMock },
                { provide: AuthService, useValue: authServiceMock },
            ],
        });
    });

    it('doit traiter l’erreur 401 en notifiant l’expiration de session et en déclenchant logout', () => {
        const req = new HttpRequest('GET', '/api/users');
        const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => error));

        executeInterceptor(req, next).subscribe({
            error: (err) => {
                expect(err).toBe(error);
            },
        });

        expect(toasterServiceMock.error).toHaveBeenCalledWith('Session expirée', 'Veuillez vous reconnecter.');
        expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('doit afficher un toast d’échec de connexion sans appeler logout lors d’une erreur 401 sur /auth/login', () => {
        const req = new HttpRequest('POST', '/api/v1/auth/login', {});
        const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => error));

        executeInterceptor(req, next).subscribe({
            error: () => {
                // Erreur interceptée
            },
        });

        expect(authServiceMock.logout).not.toHaveBeenCalled();
        expect(toasterServiceMock.error).toHaveBeenCalledWith('Échec de connexion', 'Identifiants incorrects. Vérifiez vos informations.');
    });

    it('doit traiter l’erreur 403 en affichant un toast d’accès refusé', () => {
        const req = new HttpRequest('GET', '/api/admin/config');
        const error = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => error));

        executeInterceptor(req, next).subscribe({
            error: (err) => {
                expect(err).toBe(error);
            },
        });

        expect(toasterServiceMock.error).toHaveBeenCalledWith('Accès refusé', "Vous n'avez pas les droits nécessaires pour effectuer cette action.");
    });

    it('doit traiter le code d’erreur 0 correspondant à une perte réseau ou un serveur injoignable', () => {
        const req = new HttpRequest('GET', '/api/data');
        const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => error));

        executeInterceptor(req, next).subscribe({
            error: (err) => {
                expect(err).toBe(error);
            },
        });

        expect(toasterServiceMock.error).toHaveBeenCalledWith('Erreur réseau', 'Impossible de joindre le serveur. Vérifiez votre connexion.');
    });

    it('doit formater les erreurs NestJS contenant un tableau de messages de validation', () => {
        const req = new HttpRequest('POST', '/api/users', {});
        const error = new HttpErrorResponse({
            status: 400,
            error: { message: ['Email is invalid', 'Password too short'] },
        });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => error));

        executeInterceptor(req, next).subscribe({
            error: (err) => {
                expect(err).toBe(error);
            },
        });

        expect(toasterServiceMock.error).toHaveBeenCalledWith('Erreur', 'Email is invalid, Password too short');
    });

    it('doit afficher les erreurs backend contenant un message unique de type chaîne', () => {
        const req = new HttpRequest('POST', '/api/users', {});
        const error = new HttpErrorResponse({
            status: 409,
            error: { message: 'Cet email existe déjà' },
        });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => error));

        executeInterceptor(req, next).subscribe({
            error: (err) => {
                expect(err).toBe(error);
            },
        });

        expect(toasterServiceMock.error).toHaveBeenCalledWith('Erreur', 'Cet email existe déjà');
    });

    it('doit se replier sur le message par défaut pour toute erreur inattendue', () => {
        const req = new HttpRequest('GET', '/api/unknown');
        const error = new HttpErrorResponse({ status: 500 });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => error));

        executeInterceptor(req, next).subscribe({
            error: (err) => {
                expect(err).toBe(error);
            },
        });

        expect(toasterServiceMock.error).toHaveBeenCalledWith('Erreur inattendue', 'Une erreur technique est survenue.');
    });
});
