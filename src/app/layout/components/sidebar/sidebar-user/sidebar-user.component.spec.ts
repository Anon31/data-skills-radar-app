import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { SidebarUserComponent } from './sidebar-user.component';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { IAuthUser } from '../../../../features/auth/models/login.model';

describe('SidebarUserComponent', () => {
    let component: SidebarUserComponent;
    let fixture: ComponentFixture<SidebarUserComponent>;
    let userConnectedMock: WritableSignal<IAuthUser | null>;

    beforeEach(async () => {
        userConnectedMock = signal<IAuthUser | null>(null);

        await TestBed.configureTestingModule({
            imports: [SidebarUserComponent],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        userConnected: userConnectedMock,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarUserComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('isOpen', true);
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    describe('lorsque l’utilisateur est null (invité)', () => {
        it('doit calculer fullName à "Non connecté"', () => {
            expect(component.fullName()).toBe('Non connecté');
        });

        it('doit calculer initials à "--"', () => {
            expect(component.initials()).toBe('--');
        });

        it('doit calculer roleLabel à "GUEST"', () => {
            expect(component.roleLabel()).toBe('GUEST');
        });
    });

    describe('lorsque l’utilisateur est connecté', () => {
        beforeEach(() => {
            userConnectedMock.set({
                id: '42',
                email: 'alan.turing@dsr.fr',
                firstname: 'Alan',
                lastname: 'Turing',
                role: 'ADMIN',
            });
            fixture.detectChanges();
        });

        it('doit calculer fullName avec le prénom et le nom de famille', () => {
            expect(component.fullName()).toBe('Alan Turing');
        });

        it('doit calculer les initiales en majuscules', () => {
            expect(component.initials()).toBe('AT');
        });

        it('doit calculer roleLabel avec la valeur ADMIN', () => {
            expect(component.roleLabel()).toBe('ADMIN');
        });
    });
});
