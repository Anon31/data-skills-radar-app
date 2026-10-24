import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageCardWrapperComponent } from './page-card-wrapper.component';

describe('PageCardWrapperComponent', () => {
    let component: PageCardWrapperComponent;
    let fixture: ComponentFixture<PageCardWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageCardWrapperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PageCardWrapperComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher le titre et le sous-titre lorsque ces inputs sont fournis', () => {
        fixture.componentRef.setInput('title', 'Gestion des offres');
        fixture.componentRef.setInput('subtitle', 'Sous-titre explicatif');
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('Gestion des offres');
        expect(compiled.textContent).toContain('Sous-titre explicatif');
    });

    it('doit afficher l’icône lorsque l’input icon est renseigné', () => {
        fixture.componentRef.setInput('title', 'Vue Carte');
        fixture.componentRef.setInput('icon', 'map');
        fixture.detectChanges();

        const iconSpan = fixture.nativeElement.querySelector('.material-symbols-outlined') as HTMLElement;
        expect(iconSpan).not.toBeNull();
        expect(iconSpan.textContent).toContain('map');
    });

    it('doit afficher ou masquer la barre de séparation selon hideDivider', () => {
        fixture.componentRef.setInput('title', 'Titre');
        fixture.componentRef.setInput('hideDivider', false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('p-divider')).not.toBeNull();

        fixture.componentRef.setInput('hideDivider', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('p-divider')).toBeNull();
    });
});
