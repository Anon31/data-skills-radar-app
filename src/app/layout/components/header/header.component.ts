import { ToasterService } from '../../../core/services/toaster.service';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, inject, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Chip } from 'primeng/chip';

@Component({
    selector: 'app-header',
    imports: [ButtonModule, Chip],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    public toggleSidebar = output<void>();

    public readonly authService = inject(AuthService);
    public readonly sessionService = inject(SessionService);
    private readonly toastService = inject(ToasterService);
    private readonly router = inject(Router);

    // Ajout d'une référence directe au signal pour le template
    public readonly user = this.authService.userConnected;

    public logout(): void {
        this.authService.logout();

        // Résolution propre de la promesse exigée par WebStorm
        this.router.navigate(['/connexion']).then(() => {
            this.toastService.info('Déconnexion réussie', 'À très bientôt sur Data Skills Radar ! 👋');
        });
    }
}
