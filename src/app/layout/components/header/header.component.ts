import { ToasterService } from '../../../core/services/toaster.service';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    public readonly authService = inject(AuthService);
    public readonly sessionService = inject(SessionService);
    private readonly toastService = inject(ToasterService);
    private readonly router = inject(Router);

    public logout(): void {
        this.authService.logout();

        // Résolution propre de la promesse exigée par WebStorm
        this.router.navigate(['/connexion']).then(() => {
            this.toastService.info('Déconnexion réussie', 'À très bientôt sur Data Skills Radar ! 👋');
        });
    }
}
