import { AuthService } from '../../features/auth/services/auth.service';
import { ToasterService } from '../services/toaster.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Guard vérifiant si l'utilisateur est authentifié.
 * Redirige vers /connexion si l'accès est refusé.
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toasterService = inject(ToasterService);

    // Vérification via le Signal réactif
    if (authService.userConnected() !== null) {
        return true;
    }

    // Affichage d'un toast d'erreur
    toasterService.error('Accès refusé', "Veuillez vous connecter pour accéder à l'application.");

    // Redirection vers la page de connexion
    void router.navigate(['/connexion']);
    return false;
};
