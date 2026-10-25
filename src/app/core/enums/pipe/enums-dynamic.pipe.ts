import { EnumsDataService } from '../service/enums-data.service';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { EnumReferenceData } from '../model/enums.model';

/**
 * Traduit dynamiquement n'importe quelle énumération en priorisant les traductions françaises locales.
 */
@Pipe({
    name: 'enumsDynamic',
    standalone: true,
})
export class EnumsDynamicPipe implements PipeTransform {
    private readonly enumsDataService = inject(EnumsDataService);

    // Dictionnaire de traductions locales adapté au schéma Data Skills Radar
    private readonly fallbackTranslations: Record<string, string> = {
        // Role
        ADMIN: 'Administrateur',
        USER: 'Utilisateur',
        VISITOR: 'Visiteur',

        // NiveauImpactIA
        FORT: 'Fort',
        MOYEN: 'Moyen',
        FAIBLE: 'Faible',
        INCONNU: 'Inconnu',

        // CategorieCompetence
        TECHNIQUE: 'Technique',
        COMPORTEMENTALE: 'Comportementale',
        OUTIL: 'Outil',
        CERTIFICATION: 'Certification',

        // TypeTache
        COGNITIVE_ROUTINIERE: 'Cognitive Routinière',
        COGNITIVE_COMPLEXE: 'Cognitive Complexe',
        MANUELLE_ROUTINIERE: 'Manuelle Routinière',
        MANUELLE_COMPLEXE: 'Manuelle Complexe',

        // TendanceEmploi
        EN_CROISSANCE: 'En Croissance',
        EN_DECLIN: 'En Déclin',
        EN_MUTATION: 'En Mutation',
        STABLE: 'Stable',
    };

    transform(value: string | null | undefined, enumCategory?: keyof EnumReferenceData): string {
        if (!value) return '';

        // 1. Priorité au dictionnaire local
        if (this.fallbackTranslations[value]) {
            return this.fallbackTranslations[value];
        }

        // 2. Fallback via le backend
        const enums = this.enumsDataService.enumsData();
        if (enums && enumCategory && enums[enumCategory]?.[value]) {
            return enums[enumCategory][value];
        }

        // 3. Fallback de secours (formatage de la chaîne brute)
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replaceAll('_', ' ');
    }
}
