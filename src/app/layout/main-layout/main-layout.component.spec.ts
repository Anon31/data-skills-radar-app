import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
    let component: MainLayoutComponent;
    let fixture: ComponentFixture<MainLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainLayoutComponent],
            providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
        }).compileComponents();

        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher les composants app-sidebar, app-header, router-outlet et app-footer', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('app-sidebar')).not.toBeNull();
        expect(compiled.querySelector('app-header')).not.toBeNull();
        expect(compiled.querySelector('router-outlet')).not.toBeNull();
        expect(compiled.querySelector('app-footer')).not.toBeNull();
    });
});
