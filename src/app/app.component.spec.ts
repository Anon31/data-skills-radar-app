import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let app: AppComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [MessageService, provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit créer le composant racine', () => {
        expect(app).toBeTruthy();
    });

    it('doit initialiser le signal title avec "data-skills-radar-app"', () => {
        expect((app as unknown as { title: () => string }).title()).toBe('data-skills-radar-app');
    });

    it('doit afficher les composants p-toast, router-outlet et app-toggle-dark-mode dans le template', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('p-toast')).not.toBeNull();
        expect(compiled.querySelector('app-toggle-dark-mode')).not.toBeNull();
        expect(compiled.querySelector('router-outlet')).not.toBeNull();
    });
});
