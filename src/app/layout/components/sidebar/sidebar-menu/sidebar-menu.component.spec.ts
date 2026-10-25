import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { PermissionService } from '../../../../core/services/permission.service';

describe('SidebarMenuComponent', () => {
    let component: SidebarMenuComponent;
    let fixture: ComponentFixture<SidebarMenuComponent>;
    let isAdminSignal: WritableSignal<boolean>;

    beforeEach(async () => {
        isAdminSignal = signal(true);

        await TestBed.configureTestingModule({
            imports: [SidebarMenuComponent],
            providers: [
                provideRouter([]),
                {
                    provide: PermissionService,
                    useValue: {
                        isAdmin: isAdminSignal,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarMenuComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('isOpen', true);
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher Général et Administration pour un administrateur', () => {
        isAdminSignal.set(true);
        const categories = component.categories();
        expect(categories.length).toBe(2);
        expect(categories[0].title).toBe('Général');
        expect(categories[1].title).toBe('Administration');
        expect(categories[0].items.some((i) => i.route === '/tableau-de-bord')).toBe(true);
        expect(categories[1].items.some((i) => i.route === '/utilisateurs')).toBe(true);
    });

    it('ne doit pas afficher la catégorie Administration pour un utilisateur non-admin', () => {
        isAdminSignal.set(false);
        const categories = component.categories();
        expect(categories.length).toBe(1);
        expect(categories[0].title).toBe('Général');
        expect(categories.some((c) => c.title === 'Administration')).toBe(false);
    });

    it('doit générer les liens de navigation actifs ainsi que les éléments désactivés avec badge', () => {
        fixture.detectChanges();
        const links = fixture.nativeElement.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);

        const textContent = fixture.nativeElement.textContent;
        expect(textContent).toContain('Bientôt');
    });
});
