import { TestBed } from '@angular/core/testing';
import { ToasterService } from './toaster.service';
import { MessageService } from 'primeng/api';

describe('ToasterService', () => {
    let service: ToasterService;
    let messageServiceSpy: { add: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        messageServiceSpy = {
            add: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [ToasterService, { provide: MessageService, useValue: messageServiceSpy }],
        });

        service = TestBed.inject(ToasterService);
    });

    it('doit être correctement instancié', () => {
        expect(service).toBeTruthy();
    });

    it('doit déclencher une notification de succès avec les bons paramètres', () => {
        service.success('Succès', 'Opération réussie');

        expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Succès',
            detail: 'Opération réussie',
        });
    });

    it('doit déclencher une notification d’erreur avec les bons paramètres', () => {
        service.error('Erreur', 'Une erreur est survenue');

        expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue',
        });
    });

    it('doit déclencher une notification d’information avec les bons paramètres', () => {
        service.info('Info', 'Information système');

        expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'info',
            summary: 'Info',
            detail: 'Information système',
        });
    });

    it('doit déclencher une notification d’avertissement avec les bons paramètres', () => {
        service.warn('Attention', 'Attention aux données');

        expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary: 'Attention',
            detail: 'Attention aux données',
        });
    });
});
