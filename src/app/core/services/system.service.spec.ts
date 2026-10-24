import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SystemService } from './system.service';
import { SystemStatus } from '../models/system-status.model';
import { environment } from '../../../environments/environment';

describe('SystemService', () => {
    let service: SystemService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SystemService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(SystemService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('doit être correctement instancié', () => {
        expect(service).toBeTruthy();
    });

    it('doit récupérer le statut système via un appel GET vers l’URL configurée', () => {
        const mockStatus: SystemStatus = {
            environment: 'production',
            vaultSecured: true,
            version: '1.2.0',
            timestamp: '2026-10-24T22:00:00Z',
        };

        service.getSystemStatus().subscribe((status) => {
            expect(status).toEqual(mockStatus);
            expect(status.vaultSecured).toBe(true);
            expect(status.version).toBe('1.2.0');
        });

        const req = httpMock.expectOne(`${environment.API_URL}/system/status`);
        expect(req.request.method).toBe('GET');
        req.flush(mockStatus);
    });
});
