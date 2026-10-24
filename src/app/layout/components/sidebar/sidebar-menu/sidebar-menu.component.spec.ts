import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarMenuComponent } from './sidebar-menu.component';

describe('SidebarMenuComponent', () => {
    let component: SidebarMenuComponent;
    let fixture: ComponentFixture<SidebarMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidebarMenuComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarMenuComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('isOpen', true);
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit contenir les catégories prédéfinies de navigation (Général et Administration)', () => {
        const categories = component.categories();
        expect(categories.length).toBe(2);
        expect(categories[0].title).toBe('Général');
        expect(categories[1].title).toBe('Administration');
        expect(categories[0].items.some((i) => i.route === '/tableau-de-bord')).toBe(true);
        expect(categories[1].items.some((i) => i.route === '/utilisateurs')).toBe(true);
    });

    it('doit générer les liens de navigation dans le template', () => {
        fixture.detectChanges();
        const links = fixture.nativeElement.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
    });
});
