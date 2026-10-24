import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
    let component: PageNotFoundComponent;
    let fixture: ComponentFixture<PageNotFoundComponent>;
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };
    let locationSpy: { back: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        routerSpy = { navigate: vi.fn() };
        locationSpy = { back: vi.fn() };

        await TestBed.configureTestingModule({
            imports: [PageNotFoundComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: Location, useValue: locationSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PageNotFoundComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit revenir à la page précédente de l’historique navigateur via goBack()', () => {
        component.goBack();
        expect(locationSpy.back).toHaveBeenCalledTimes(1);
    });

    it('doit naviguer vers la racine de l’application via goHome()', () => {
        component.goHome();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
});
