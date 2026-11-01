import { AuthService } from '../../../../features/auth/services/auth.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    standalone: true,
    imports: [RouterLink, NgClass],
    selector: 'app-sidebar-user',
    styleUrl: './sidebar-user.component.css',
    templateUrl: './sidebar-user.component.html',
})
export class SidebarUserComponent {
    isOpen = input.required<boolean>();

    private readonly authService = inject(AuthService);
    private readonly permissionService = inject(PermissionService);

    // Le signal réactif contenant l'utilisateur actuel
    public readonly user = this.authService.userConnected;
    public readonly canAccessAccount = this.permissionService.canUseAdvancedFilters;

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
