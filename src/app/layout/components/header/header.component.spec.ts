import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../features/auth/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { IAuthUser } from '../../../features/auth/models/login.model';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let authServiceMock: {
        userConnected: ReturnType<typeof signal<IAuthUser | null>>;
        logout: ReturnType<typeof vi.fn>;
    };
    let sessionServiceMock: { toggleSidebar: ReturnType<typeof vi.fn> };
    let toasterServiceMock: { info: ReturnType<typeof vi.fn> };
    let routerMock: { navigate: ReturnType<typeof vi.fn> };

    const mockUser: IAuthUser = {
        id: '1',
        email: 'user@dsr.fr',
        firstname: 'Sophie',
        lastname: 'Germain',
        role: 'ADMIN',
    };

    beforeEach(async () => {
        authServiceMock = {
            userConnected: signal<IAuthUser | null>(mockUser),
            logout: vi.fn(),
        };
        sessionServiceMock = {
            toggleSidebar: vi.fn(),
        };
        toasterServiceMock = {
            info: vi.fn(),
        };
        routerMock = {
            navigate: vi.fn().mockResolvedValue(true),
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: ToasterService, useValue: toasterServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit émettre l’événement toggleSidebar au clic sur le bouton menu', () => {
        const emitSpy = vi.fn();
        component.toggleSidebar.subscribe(emitSpy);

        const menuButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        menuButton.click();

        expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('doit afficher le nom complet et le badge du rôle lorsque l’utilisateur est connecté', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Sophie Germain');
        expect(compiled.textContent).toContain('(ADMIN)');
    });

    it('doit exécuter logout(), naviguer vers /connexion et afficher un toast d’information', async () => {
        component.logout();

        expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/connexion']);

        await Promise.resolve();
        expect(toasterServiceMock.info).toHaveBeenCalledWith('Déconnexion réussie', 'À très bientôt sur Data Skills Radar ! 👋');
    });
});
