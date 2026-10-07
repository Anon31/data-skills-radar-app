import { AuthService } from '../../../../core/services/auth.service';
import { Component, computed, inject, input } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-sidebar-user',
    styleUrl: './sidebar-user.component.css',
    templateUrl: './sidebar-user.component.html',
})
export class SidebarUserComponent {
    isOpen = input.required<boolean>();

    private readonly authService = inject(AuthService);

    // Le signal réactif contenant l'utilisateur actuel
    public readonly user = this.authService.userConnected;

    // Calcul automatique du nom complet
    public readonly fullName = computed(() => {
        const u = this.user();
        return u ? `${u.firstname} ${u.lastname}` : 'Non connecté';
    });

    // Extraction sécurisée des initiales
    public readonly initials = computed(() => {
        const u = this.user();
        if (!u?.firstname || !u.lastname) return '--';
        return `${u.firstname.charAt(0)}${u.lastname.charAt(0)}`.toUpperCase();
    });

    // Affichage du rôle
    public readonly roleLabel = computed(() => {
        const u = this.user();
        return u ? u.role : 'GUEST';
    });
}
