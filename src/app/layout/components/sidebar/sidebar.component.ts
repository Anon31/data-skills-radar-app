import { Component, effect, signal } from '@angular/core';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';

@Component({
    selector: 'app-sidebar',
    imports: [SidebarHeaderComponent, SidebarMenuComponent, SidebarUserComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    public readonly isOpen = signal<boolean>(sessionStorage.getItem('dsr_sidebar_state') !== 'false');

    constructor() {
        effect(() => {
            sessionStorage.setItem('dsr_sidebar_state', String(this.isOpen()));
        });
    }

    public toggle(): void {
        this.isOpen.update((v) => !v);
    }
}
