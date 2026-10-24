import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FooterComponent } from './footer.component';
import { SystemService } from '../../../core/services/system.service';
import { SystemStatus } from '../../../core/models/system-status.model';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let systemServiceMock: { getSystemStatus: ReturnType<typeof vi.fn> };

    const mockStatus: SystemStatus = {
        environment: 'production',
        vaultSecured: true,
        version: 'v2.4.1',
        timestamp: '2026-10-25T00:00:00Z',
    };

    beforeEach(async () => {
        systemServiceMock = {
            getSystemStatus: vi.fn().mockReturnValue(of(mockStatus)),
        };

        await TestBed.configureTestingModule({
            imports: [FooterComponent],
            providers: [{ provide: SystemService, useValue: systemServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('doit être correctement instancié', () => {
        expect(component).toBeTruthy();
    });

    it('doit afficher le copyright et le badge contenant la version du système', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('2026 Data Skills Radar');
        expect(compiled.textContent).toContain('v2.4.1');
    });
});
