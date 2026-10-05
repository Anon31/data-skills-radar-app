import { ToasterService } from '../../../../core/services/toaster.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-form',
    imports: [FormsModule, ButtonModule, IftaLabel, InputTextModule],
    templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToasterService);
    private readonly router = inject(Router);

    // 1. Déclaration des Signals (conformément à la doc PrimeNG)
    public email = signal<string>('');
    public password = signal<string>('');

    public submitForm(): void {
        // Vérification simple des champs avant de soumettre le formulaire
        if (!this.email() || !this.password()) {
            this.toastService.error('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        // 2. Création du payload à partir des signals
        const payload = {
            email: this.email(),
            password: this.password(),
        };

        this.authService.login(payload).subscribe({
            next: (response) => {
                this.router.navigate(['/tableau-de-bord']).then(() => {
                    this.toastService.success(`Bonjour ${response.body.user.firstname}.`, `🌿 Bienvenue dans votre application.`);
                });
            },
            error: () => {
                this.toastService.error('💥 Accès refusé', '🐞 Vérifiez vos informations.');
            },
        });
    }
}
