import { TestBed } from '@angular/core/testing';
import { EnumsDynamicPipe } from './enums-dynamic.pipe';
import { EnumsDataService } from '../service/enums-data.service';
import { signal } from '@angular/core';

describe('EnumsDynamicPipe', () => {
    let pipe: EnumsDynamicPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EnumsDynamicPipe,
                {
                    provide: EnumsDataService,
                    useValue: {
                        enumsData: signal(null),
                    },
                },
            ],
        });

        pipe = TestBed.inject(EnumsDynamicPipe);
    });

    it('doit être correctement instancié', () => {
        expect(pipe).toBeTruthy();
    });

    it('doit traduire les rôles connus', () => {
        expect(pipe.transform('ADMIN')).toBe('Administrateur');
        expect(pipe.transform('USER')).toBe('Utilisateur');
        expect(pipe.transform('VISITOR')).toBe('Visiteur');
    });

    it('doit retourner une chaîne vide si la valeur est null ou undefined', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('doit formater une valeur inconnue par défaut', () => {
        expect(pipe.transform('TEST_VALEUR')).toBe('Test valeur');
    });
});
