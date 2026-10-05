import { PermissionService } from '../services/permission.service';
import { ToasterService } from '../services/toaster.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Ce guard vérifie que l'utilisateur a les droits d'administration (Rôle ADMIN).
 * Idéal pour protéger les routes de configuration technique.
 */
export const adminGuard: CanActivateFn = (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    const toasterService = inject(ToasterService);

    if (permissionService.canConfigureDataStack()) {
        return true;
    }

    toasterService.error('Accès restreint', "Vous n'avez pas les droits d'administration nécessaires pour accéder à cette zone.");

    router.navigate(['/tableau-de-bord']);
    return false;
};
