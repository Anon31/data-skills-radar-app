import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { PermissionService } from './permission.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { IAuthUser } from '../../features/auth/models/login.model';

describe('PermissionService', () => {
    let service: PermissionService;
    let userConnectedMock: WritableSignal<IAuthUser | null>;

    beforeEach(() => {
        userConnectedMock = signal<IAuthUser | null>(null);

        TestBed.configureTestingModule({
            providers: [
                PermissionService,
                {
                    provide: AuthService,
                    useValue: {
                        userConnected: userConnectedMock,
                    },
                },
            ],
        });

        service = TestBed.inject(PermissionService);
    });

    it('doit être correctement instancié', () => {
        expect(service).toBeTruthy();
    });

    describe('lorsque l’utilisateur n’est pas connecté (null)', () => {
        beforeEach(() => {
            userConnectedMock.set(null);
        });

        it('doit calculer currentRole comme étant null', () => {
            expect(service.currentRole()).toBeNull();
        });

        it('doit avoir tous les rôles et permissions désactivés (false)', () => {
            expect(service.isAdmin()).toBe(false);
            expect(service.isUser()).toBe(false);
            expect(service.isVisitor()).toBe(false);
            expect(service.canViewBasicRadar()).toBe(false);
            expect(service.canUseAdvancedFilters()).toBe(false);
            expect(service.canExportDuckDB()).toBe(false);
            expect(service.canConfigureDataStack()).toBe(false);
        });
    });

    describe('lorsque l’utilisateur a le rôle VISITOR', () => {
        beforeEach(() => {
            userConnectedMock.set({
                id: 'visitor-1',
                email: 'visitor@example.com',
                firstname: 'Visiteur',
                lastname: 'DSR',
                role: 'VISITOR',
            });
        });

        it('doit calculer currentRole à VISITOR', () => {
            expect(service.currentRole()).toBe('VISITOR');
            expect(service.isVisitor()).toBe(true);
            expect(service.isAdmin()).toBe(false);
            expect(service.isUser()).toBe(false);
        });

        it('doit autoriser l’accès au radar de base mais interdire les filtres avancés et la configuration admin', () => {
            expect(service.canViewBasicRadar()).toBe(true);
            expect(service.canUseAdvancedFilters()).toBe(false);
            expect(service.canExportDuckDB()).toBe(false);
            expect(service.canConfigureDataStack()).toBe(false);
        });
    });

    describe('lorsque l’utilisateur a le rôle USER', () => {
        beforeEach(() => {
            userConnectedMock.set({
                id: 'user-1',
                email: 'user@example.com',
                firstname: 'John',
                lastname: 'Doe',
                role: 'USER',
            });
        });

        it('doit calculer currentRole à USER', () => {
            expect(service.currentRole()).toBe('USER');
            expect(service.isUser()).toBe(true);
            expect(service.isAdmin()).toBe(false);
            expect(service.isVisitor()).toBe(false);
        });

        it('doit autoriser le radar de base, les filtres avancés et l’export DuckDB mais refuser la configuration admin', () => {
            expect(service.canViewBasicRadar()).toBe(true);
            expect(service.canUseAdvancedFilters()).toBe(true);
            expect(service.canExportDuckDB()).toBe(true);
            expect(service.canConfigureDataStack()).toBe(false);
        });
    });

    describe('lorsque l’utilisateur a le rôle ADMIN', () => {
        beforeEach(() => {
            userConnectedMock.set({
                id: 'admin-1',
                email: 'admin@example.com',
                firstname: 'Admin',
                lastname: 'System',
                role: 'ADMIN',
            });
        });

        it('doit calculer currentRole à ADMIN', () => {
            expect(service.currentRole()).toBe('ADMIN');
            expect(service.isAdmin()).toBe(true);
            expect(service.isUser()).toBe(false);
            expect(service.isVisitor()).toBe(false);
        });

        it('doit autoriser toutes les fonctionnalités y compris la configuration technique de la pile de données', () => {
            expect(service.canViewBasicRadar()).toBe(true);
            expect(service.canUseAdvancedFilters()).toBe(true);
            expect(service.canExportDuckDB()).toBe(true);
            expect(service.canConfigureDataStack()).toBe(true);
        });
    });
});
