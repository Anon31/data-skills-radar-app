import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse, HttpContext } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { loadingInterceptor, IGNORE_LOADING } from './loading-interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
    let loadingServiceMock: {
        show: ReturnType<typeof vi.fn>;
        hide: ReturnType<typeof vi.fn>;
    };

    const executeInterceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => loadingInterceptor(req, next));

    beforeEach(() => {
        loadingServiceMock = {
            show: vi.fn(),
            hide: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [{ provide: LoadingService, useValue: loadingServiceMock }],
        });
    });

    it('doit afficher le loader au début de la requête et le masquer à la fin en cas de succès', () => {
        const req = new HttpRequest('GET', '/api/data');
        const next: HttpHandlerFn = vi.fn().mockReturnValue(of(new HttpResponse({ status: 200 })));

        executeInterceptor(req, next).subscribe();

        expect(loadingServiceMock.show).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
        expect(loadingServiceMock.hide).toHaveBeenCalledTimes(1);
    });

    it('doit afficher le loader au début et le masquer même si la requête échoue', () => {
        const req = new HttpRequest('GET', '/api/data');
        const next: HttpHandlerFn = vi.fn().mockReturnValue(throwError(() => new Error('Network error')));

        executeInterceptor(req, next).subscribe({
            error: () => {
                // Erreur interceptée
            },
        });

        expect(loadingServiceMock.show).toHaveBeenCalledTimes(1);
        expect(loadingServiceMock.hide).toHaveBeenCalledTimes(1);
    });

    it('doit ignorer le loader lorsque le jeton de contexte IGNORE_LOADING vaut true', () => {
        const context = new HttpContext().set(IGNORE_LOADING, true);
        const req = new HttpRequest('GET', '/api/sync', { context });
        const next: HttpHandlerFn = vi.fn().mockReturnValue(of(new HttpResponse({ status: 200 })));

        executeInterceptor(req, next).subscribe();

        expect(loadingServiceMock.show).not.toHaveBeenCalled();
        expect(loadingServiceMock.hide).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
