import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../../environments/environment';
import { IUserDto, IUserPayload, IUserUpdatePasswordPayload } from '../models/user.model';
import { RoleEnum } from '../../../core/enums/role.enum';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    const mockUser1: IUserDto = {
        id: 'user-uuid-1',
        firstname: 'Thomas',
        lastname: 'Pesquet',
        email: 'thomas@example.com',
        birthdate: '1978-01-13',
        enabled: true,
        role: RoleEnum.USER,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    };

    const mockUser2: IUserDto = {
        id: 'user-uuid-2',
        firstname: 'Marie',
        lastname: 'Curie',
        email: 'marie@example.com',
        birthdate: '1867-11-07',
        enabled: true,
        role: RoleEnum.ADMIN,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);

        // Au démarrage (constructor), UserService lance loadUsers()
        const initReq = httpMock.expectOne(`${environment.API_URL}/users`);
        expect(initReq.request.method).toBe('GET');
        initReq.flush([mockUser1, mockUser2]);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('doit être correctement instancié et initialiser la liste des utilisateurs', () => {
        expect(service).toBeTruthy();
        expect(service.users().length).toBe(2);
        expect(service.users()[0]).toEqual(mockUser1);
        expect(service.isLoading()).toBe(false);
        expect(service.error()).toBeNull();
    });

    it('doit rafraîchir les utilisateurs lors de l’appel à refreshUsers()', () => {
        service.refreshUsers();
        expect(service.isLoading()).toBe(true);

        const req = httpMock.expectOne(`${environment.API_URL}/users`);
        expect(req.request.method).toBe('GET');
        req.flush([mockUser1]);

        expect(service.users().length).toBe(1);
        expect(service.isLoading()).toBe(false);
    });

    it('doit créer un utilisateur et l’ajouter de manière optimiste en tête du signal users', () => {
        const payload: IUserPayload = {
            firstname: 'Ada',
            lastname: 'Lovelace',
            email: 'ada@example.com',
            password: 'SecurePassword123!',
            birthdate: '1815-12-10',
            role: RoleEnum.USER,
        };

        const createdUser: IUserDto = {
            ...payload,
            id: 'user-uuid-3',
            enabled: true,
            createdAt: '2026-02-01T00:00:00Z',
            updatedAt: '2026-02-01T00:00:00Z',
        };

        service.createUser(payload).subscribe((res) => {
            expect(res).toEqual(createdUser);
        });

        const req = httpMock.expectOne(`${environment.API_URL}/users`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(createdUser);

        expect(service.users().length).toBe(3);
        expect(service.users()[0]).toEqual(createdUser);
    });

    it('doit récupérer un utilisateur par son ID', () => {
        service.getUserById('user-uuid-1').subscribe((user) => {
            expect(user).toEqual(mockUser1);
        });

        const req = httpMock.expectOne(`${environment.API_URL}/users/user-uuid-1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockUser1);
    });

    it('doit mettre à jour un utilisateur et appliquer la modification au signal users', () => {
        const patchData: Partial<IUserPayload> = { firstname: 'Tommy' };
        const updatedUser: IUserDto = { ...mockUser1, firstname: 'Tommy' };

        service.patchUser('user-uuid-1', patchData).subscribe((user) => {
            expect(user).toEqual(updatedUser);
        });

        const req = httpMock.expectOne(`${environment.API_URL}/users/user-uuid-1`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(patchData);
        req.flush(updatedUser);

        const found = service.users().find((u) => u.id === 'user-uuid-1');
        expect(found?.firstname).toBe('Tommy');
    });

    it('doit supprimer un utilisateur et le retirer du signal users', () => {
        service.deleteUser('user-uuid-1').subscribe();

        const req = httpMock.expectOne(`${environment.API_URL}/users/user-uuid-1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);

        expect(service.users().some((u) => u.id === 'user-uuid-1')).toBe(false);
        expect(service.users().length).toBe(1);
    });

    it('doit restaurer l’état d’un utilisateur avec rollbackUserUpdate()', () => {
        const alteredUser: IUserDto = { ...mockUser1, firstname: 'Erroné' };
        service.rollbackUserUpdate(0, alteredUser);
        expect(service.users()[0].firstname).toBe('Erroné');

        service.rollbackUserUpdate(0, mockUser1);
        expect(service.users()[0].firstname).toBe('Thomas');
    });

    it('doit envoyer la requête de mise à jour de mot de passe', () => {
        const passwordPayload: IUserUpdatePasswordPayload = {
            currentPassword: 'oldPassword123',
            newPassword: 'newPassword456',
        };

        service.updateMyPassword(passwordPayload).subscribe((res) => {
            expect(res.message).toBe('Mot de passe mis à jour');
        });

        const req = httpMock.expectOne(`${environment.API_URL}/users/me/password`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(passwordPayload);
        req.flush({ message: 'Mot de passe mis à jour' });
    });
});
