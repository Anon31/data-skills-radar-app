import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { PermissionService } from '../../../../core/services/permission.service';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let canUseAdvancedFiltersMock: WritableSignal<boolean>;
    let canConfigureDataStackMock: WritableSignal<boolean>;

    beforeEach(async () => {
        canUseAdvancedFiltersMock = signal<boolean>(false);
        canConfigureDataStackMock = signal<boolean>(false);

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                {
                    provide: PermissionService,
                    useValue: {
                        canUseAdvancedFilters: canUseAdvancedFiltersMock,
                        canConfigureDataStack: canConfigureDataStackMock,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher la carte premium verrouillée lorsque canUseAdvancedFilters est false', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Passer Premium');
        expect(compiled.querySelector('.premium-card')).toBeNull();
    });

    it('doit afficher la carte premium déverrouillée lorsque canUseAdvancedFilters est true', () => {
        canUseAdvancedFiltersMock.set(true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.premium-card')).not.toBeNull();
        expect(compiled.textContent).toContain('Générer Rapport CSV');
    });

    it('doit afficher la carte de monitoring infra uniquement lorsque canConfigureDataStack est true', () => {
        fixture.detectChanges();
        let compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).not.toContain('Monitoring Infra');

        canConfigureDataStackMock.set(true);
        fixture.detectChanges();

        compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Monitoring Infra');
        expect(compiled.textContent).toContain('Flux Redpanda');
    });
});
