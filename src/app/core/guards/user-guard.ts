import { PermissionService } from '../services/permission.service';
import { ToasterService } from '../services/toaster.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Ce guard vérifie que l'utilisateur possède au minimum le rôle USER (ou ADMIN).
 * Les utilisateurs VISITOR (ou invités) sont redirigés vers le tableau de bord public.
 */
export const userGuard: CanActivateFn = () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    const toasterService = inject(ToasterService);

    if (permissionService.canUseAdvancedFilters()) {
        return true;
    }

    toasterService.error('Accès réservé aux membres', 'Cette fonctionnalité nécessite un compte Utilisateur (USER).');

    void router.navigate(['/tableau-de-bord']);
    return false;
};
