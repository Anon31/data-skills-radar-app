import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    let service: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingService],
        });
        service = TestBed.inject(LoadingService);
    });

    it('doit être correctement instancié', () => {
        expect(service).toBeTruthy();
    });

    it('doit initialiser le signal loading à false', () => {
        expect(service.loading()).toBe(false);
    });

    it('doit passer loading à true lors d’un appel à show()', () => {
        service.show();
        expect(service.loading()).toBe(true);
    });

    it('doit maintenir loading à true lors d’appels multiples à show()', () => {
        service.show();
        service.show();
        expect(service.loading()).toBe(true);
    });

    it('doit conserver loading à true après un hide() si plusieurs show() ont été émis', () => {
        service.show();
        service.show();
        service.hide();
        expect(service.loading()).toBe(true);

        service.hide();
        expect(service.loading()).toBe(false);
    });

    it('ne doit jamais descendre en dessous de 0 lorsque hide() est appelé alors que le compteur vaut 0', () => {
        service.hide();
        expect(service.loading()).toBe(false);

        service.show();
        expect(service.loading()).toBe(true);
        service.hide();
        expect(service.loading()).toBe(false);
    });
});
