import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {
    private readonly location = inject(Location);
    private readonly router = inject(Router);

    public goBack(): void {
        // Retourne exactement à la page précédente dans l'historique du navigateur
        this.location.back();
    }

    public goHome(): void {
        // Redirige vers la racine (le garde de sécurité se chargera d'envoyer vers Login ou Dashboard)
        this.router.navigate(['/']);
    }
}
