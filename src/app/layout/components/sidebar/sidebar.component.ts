import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';
import { SessionService } from '../../../core/services/session.service';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    imports: [SidebarHeaderComponent, SidebarMenuComponent, SidebarUserComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    private readonly sessionService = inject(SessionService);

    public readonly isOpen = this.sessionService.isSidebarOpen;

    public toggle(): void {
        this.sessionService.toggleSidebar();
    }
}
