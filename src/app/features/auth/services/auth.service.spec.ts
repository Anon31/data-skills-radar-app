import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { IAuthUser, ILoginDto, ILoginPayload } from '../models/login.model';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };

    // Faux token JWT : en-tête.chargeUtile.signature avec expiration en 2099
    const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjQxMDI0NDQ4MDB9.c2lnbmF0dXJl';
    // Token JWT expiré : expiration passée
    const expiredJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjk0NjY4NDgwMH0.c2lnbmF0dXJl';

    const mockUser: IAuthUser = {
        id: 'u-1',
        email: 'user@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        role: 'USER',
    };

    beforeEach(() => {
        localStorage.clear();
        routerSpy = {
            navigate: vi.fn().mockResolvedValue(true),
        };

        TestBed.configureTestingModule({
            providers: [AuthService, provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: routerSpy }],
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('doit être correctement instancié', () => {
        expect(service).toBeTruthy();
    });

    describe('saveToken et getToken', () => {
        it('doit enregistrer le jeton dans localStorage et mettre à jour le signal token', () => {
            service.saveToken(validJwt);
            expect(localStorage.getItem('JWT_TOKEN')).toBe(validJwt);
            expect(service.getToken()).toBe(validJwt);
        });
    });

    describe('isTokenExpired et isAuthenticated', () => {
        it('doit indiquer que le jeton est expiré quand aucun jeton n’est présent', () => {
            expect(service.isTokenExpired()).toBe(true);
            expect(service.isAuthenticated()).toBe(false);
        });

        it('doit indiquer que le jeton est valide lorsqu’un jeton non expiré est enregistré', () => {
            service.saveToken(validJwt);
            expect(service.isTokenExpired()).toBe(false);
            expect(service.isAuthenticated()).toBe(true);
        });

        it('doit indiquer que le jeton est expiré lorsqu’un jeton périmé est enregistré', () => {
            service.saveToken(expiredJwt);
            expect(service.isTokenExpired()).toBe(true);
            expect(service.isAuthenticated()).toBe(false);
        });
    });

    describe('login', () => {
        it('doit envoyer une requête POST à /auth/login et enregistrer le jeton et l’utilisateur', () => {
            const payload: ILoginPayload = { email: 'user@example.com', password: 'password123' };
            const loginResponse: ILoginDto = {
                access_token: validJwt,
                message: 'Success',
                user: mockUser,
            };

            service.login(payload).subscribe((res) => {
                expect(res.body).toEqual(loginResponse);
                expect(service.getToken()).toBe(validJwt);
                expect(service.userConnected()).toEqual(mockUser);
                expect(localStorage.getItem('JWT_TOKEN')).toBe(validJwt);
                expect(localStorage.getItem('USER_DATA')).toBe(JSON.stringify(mockUser));
            });

            const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(loginResponse);
        });
    });

    describe('logout', () => {
        it('doit appeler l’API /auth/logout, réinitialiser l’état et rediriger vers /connexion', () => {
            service.saveToken(validJwt);
            localStorage.setItem('USER_DATA', JSON.stringify(mockUser));

            service.logout();

            const req = httpMock.expectOne(`${environment.API_URL}/auth/logout`);
            expect(req.request.method).toBe('POST');
            req.flush({});

            expect(service.getToken()).toBeNull();
            expect(service.userConnected()).toBeNull();
            expect(localStorage.getItem('JWT_TOKEN')).toBeNull();
            expect(localStorage.getItem('USER_DATA')).toBeNull();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/connexion']);
        });

        it('doit réinitialiser l’état et naviguer vers /connexion même en cas d’erreur HTTP sur logout', () => {
            service.saveToken(validJwt);
            service.logout();

            const req = httpMock.expectOne(`${environment.API_URL}/auth/logout`);
            req.flush('Error', { status: 500, statusText: 'Server Error' });

            expect(service.getToken()).toBeNull();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/connexion']);
        });
    });

    describe('loadToken', () => {
        it('doit restaurer le jeton et l’utilisateur depuis localStorage si le jeton est valide', () => {
            localStorage.setItem('JWT_TOKEN', validJwt);
            localStorage.setItem('USER_DATA', JSON.stringify(mockUser));

            service.loadToken();

            expect(service.getToken()).toBe(validJwt);
            expect(service.userConnected()).toEqual(mockUser);
        });

        it('doit réinitialiser l’état si le jeton stocké est expiré', () => {
            localStorage.setItem('JWT_TOKEN', expiredJwt);
            localStorage.setItem('USER_DATA', JSON.stringify(mockUser));

            service.loadToken();

            expect(service.getToken()).toBeNull();
            expect(service.userConnected()).toBeNull();
            expect(localStorage.getItem('JWT_TOKEN')).toBeNull();
        });

        it('doit gérer un JSON corrompu dans USER_DATA sans planter', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            localStorage.setItem('JWT_TOKEN', validJwt);
            localStorage.setItem('USER_DATA', 'invalid-json{');

            service.loadToken();

            expect(service.getToken()).toBe(validJwt);
            expect(service.userConnected()).toBeNull();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('doit restaurer la session invité depuis localStorage si role === VISITOR', () => {
            const guestUser: IAuthUser = {
                id: 'guest',
                firstname: 'Invité',
                lastname: '',
                email: '',
                role: 'VISITOR',
            };
            localStorage.setItem('USER_DATA', JSON.stringify(guestUser));

            service.loadToken();

            expect(service.getToken()).toBeNull();
            expect(service.userConnected()).toEqual(guestUser);
        });
    });

    describe('loginAsGuest', () => {
        it('doit initialiser un utilisateur virtuel avec le rôle VISITOR sans token', () => {
            service.loginAsGuest();

            expect(service.getToken()).toBeNull();
            expect(service.isAuthenticated()).toBe(false);
            expect(service.userConnected()).toEqual({
                id: 'guest',
                firstname: 'Invité',
                lastname: '',
                email: '',
                role: 'VISITOR',
            });
            expect(localStorage.getItem('USER_DATA')).toContain('VISITOR');
        });
    });
});
