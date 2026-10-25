import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, computed, inject, input } from '@angular/core';
import { PermissionService } from '../../../../core/services/permission.service';

export interface IMenuItem {
    id: number;
    label: string;
    icon: string;
    route?: string;
    disabled?: boolean;
    badge?: string;
}

export interface IMenuCategory {
    title: string;
    visible?: boolean;
    items: IMenuItem[];
}

@Component({
    imports: [RouterLink, RouterLinkActive],
    selector: 'app-sidebar-menu',
    styleUrl: './sidebar-menu.component.css',
    templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent {
    isOpen = input.required<boolean>();

    private readonly permissionService = inject(PermissionService);

    public readonly categories = computed<IMenuCategory[]>(() => {
        const isAdmin = this.permissionService.isAdmin();

        const allCategories: IMenuCategory[] = [
            {
                title: 'Général',
                visible: true,
                items: [
                    { id: 1, label: 'Tableau de bord', icon: 'radar', route: '/tableau-de-bord' },
                    { id: 2, label: 'Matrice Compétences', icon: 'grid_view', disabled: true, badge: 'Bientôt' },
                    { id: 3, label: 'Indicateurs Macro', icon: 'query_stats', disabled: true, badge: 'Bientôt' },
                    { id: 4, label: 'Data Lab', icon: 'science', disabled: true, badge: 'Bientôt' },
                ],
            },
            {
                title: 'Administration',
                visible: isAdmin,
                items: [
                    { id: 5, label: 'Utilisateurs', icon: 'group', route: '/utilisateurs' },
                    { id: 6, label: 'Configuration', icon: 'settings', disabled: true, badge: 'Bientôt' },
                ],
            },
        ];

        return allCategories.filter((category) => category.visible);
    });
}
