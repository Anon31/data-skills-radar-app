import { PermissionService } from '../services/permission.service';
import { ToasterService } from '../services/toaster.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Ce guard vérifie que l'utilisateur a les droits Premium (Rôle USER ou ADMIN).
 * Bloque l'accès aux Visiteurs.
 */
export const premiumGuard: CanActivateFn = (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    const toasterService = inject(ToasterService);

    // On utilise le signal qui regroupe USER et ADMIN
    if (permissionService.canUseAdvancedFilters()) {
        return true;
    }

    toasterService.warn('Accès Premium Requis', 'Cette fonctionnalité est réservée aux abonnés. Passez Premium pour y accéder.');

    // On renvoie le visiteur vers le tableau de bord
    router.navigate(['/tableau-de-bord']);
    return false;
};
