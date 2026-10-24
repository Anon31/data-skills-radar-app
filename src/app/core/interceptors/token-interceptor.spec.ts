import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tokenInterceptor } from './token-interceptor';
import { AuthService } from '../services/auth.service';

describe('tokenInterceptor', () => {
    let authServiceMock: { getToken: ReturnType<typeof vi.fn> };
    const executeInterceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => tokenInterceptor(req, next));

    beforeEach(() => {
        authServiceMock = {
            getToken: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [{ provide: AuthService, useValue: authServiceMock }],
        });
    });

    it('doit ajouter l’en-tête Authorization Bearer pour les routes protégées lorsque le jeton existe', () => {
        authServiceMock.getToken.mockReturnValue('my-jwt-token');
        const req = new HttpRequest('GET', '/api/v1/users');
        const next: HttpHandlerFn = vi.fn().mockReturnValue(of(new HttpResponse({ status: 200 })));

        executeInterceptor(req, next);

        expect(next).toHaveBeenCalledTimes(1);
        const modifiedReq = (next as ReturnType<typeof vi.fn>).mock.calls[0][0] as HttpRequest<unknown>;
        expect(modifiedReq.headers.get('Authorization')).toBe('Bearer my-jwt-token');
    });

    it('ne doit PAS ajouter d’en-tête Authorization si aucun jeton n’est présent', () => {
        authServiceMock.getToken.mockReturnValue(null);
        const req = new HttpRequest('GET', '/api/v1/users');
        const next: HttpHandlerFn = vi.fn().mockReturnValue(of(new HttpResponse({ status: 200 })));

        executeInterceptor(req, next);

        expect(next).toHaveBeenCalledTimes(1);
        const passedReq = (next as ReturnType<typeof vi.fn>).mock.calls[0][0] as HttpRequest<unknown>;
        expect(passedReq.headers.has('Authorization')).toBe(false);
    });

    it('ne doit PAS ajouter d’en-tête Authorization pour la route publique /auth/login même avec un jeton', () => {
        authServiceMock.getToken.mockReturnValue('my-jwt-token');
        const req = new HttpRequest('POST', '/api/v1/auth/login', {});
        const next: HttpHandlerFn = vi.fn().mockReturnValue(of(new HttpResponse({ status: 200 })));

        executeInterceptor(req, next);

        const passedReq = (next as ReturnType<typeof vi.fn>).mock.calls[0][0] as HttpRequest<unknown>;
        expect(passedReq.headers.has('Authorization')).toBe(false);
    });

    it('ne doit PAS ajouter d’en-tête Authorization pour les routes publiques /system/ même avec un jeton', () => {
        authServiceMock.getToken.mockReturnValue('my-jwt-token');
        const req = new HttpRequest('GET', '/api/v1/system/status');
        const next: HttpHandlerFn = vi.fn().mockReturnValue(of(new HttpResponse({ status: 200 })));

        executeInterceptor(req, next);

        const passedReq = (next as ReturnType<typeof vi.fn>).mock.calls[0][0] as HttpRequest<unknown>;
        expect(passedReq.headers.has('Authorization')).toBe(false);
    });
});
