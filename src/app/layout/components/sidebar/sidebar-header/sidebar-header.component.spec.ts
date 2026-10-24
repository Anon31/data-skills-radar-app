import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarHeaderComponent } from './sidebar-header.component';

describe('SidebarHeaderComponent', () => {
    let component: SidebarHeaderComponent;
    let fixture: ComponentFixture<SidebarHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidebarHeaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarHeaderComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('isOpen', true);
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher le texte du titre lorsque isOpen est true', () => {
        fixture.componentRef.setInput('isOpen', true);
        fixture.detectChanges();

        const titleEl = fixture.nativeElement.querySelector('h1') as HTMLElement;
        expect(titleEl).not.toBeNull();
        expect(titleEl.textContent).toContain('Data Skills');
        expect(titleEl.textContent).toContain('Radar');
        expect(titleEl.classList.contains('opacity-100')).toBe(true);
    });

    it('doit appliquer la classe opacity-0 sur le titre lorsque isOpen est false', () => {
        fixture.componentRef.setInput('isOpen', false);
        fixture.detectChanges();

        const titleEl = fixture.nativeElement.querySelector('h1') as HTMLElement;
        expect(titleEl.classList.contains('opacity-0')).toBe(true);
    });
});
