import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, input, signal } from '@angular/core';

@Component({
    imports: [RouterLink, RouterLinkActive],
    selector: 'app-sidebar-menu',
    styleUrl: './sidebar-menu.component.css',
    templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent {
    isOpen = input.required<boolean>();

    categories = signal([
        {
            title: 'Général',
            items: [
                { id: 1, label: 'Tableau de bord', icon: 'radar', route: '/tableau-de-bord' },
                { id: 2, label: 'Matrice Compétences', icon: 'grid_view', route: '/matrice' },
                { id: 3, label: 'Indicateurs Macro', icon: 'query_stats', route: '/indicateurs' },
                { id: 4, label: 'Data Lab', icon: 'science', route: '/laboratoire' },
            ],
        },
        {
            title: 'Administration',
            items: [
                { id: 5, label: 'Utilisateurs', icon: 'group', route: '/utilisateurs' },
                { id: 6, label: 'Configuration', icon: 'settings', route: '/configuration' },
            ],
        },
    ]);
}
