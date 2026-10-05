import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private readonly authService = inject(AuthService);

    // 1. État courant
    public readonly currentRole = computed(() => this.authService.userConnected()?.role ?? null);

    // 2. Définition de tes rôles structurels
    public readonly isAdmin = computed(() => this.currentRole() === 'ADMIN');
    public readonly isUser = computed(() => this.currentRole() === 'USER');
    public readonly isVisitor = computed(() => this.currentRole() === 'VISITOR');

    // --- 3. PERMISSIONS MÉTIER (Granularité pour l'UI) ---

    // Niveau 1 : Accès à l'application de base (Tout le monde connecté)
    public readonly canViewBasicRadar = computed(() => this.currentRole() !== null);

    // Niveau 2 : Fonctionnalités Premium (Abonnés et Admin)
    public readonly canUseAdvancedFilters = computed(() => this.isAdmin() || this.isUser());
    public readonly canExportDuckDB = computed(() => this.isAdmin() || this.isUser());

    // Niveau 3 : Administration technique (Toi seul)
    public readonly canConfigureDataStack = computed(() => this.isAdmin());
}
