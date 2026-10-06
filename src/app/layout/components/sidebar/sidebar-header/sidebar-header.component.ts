import { Component, input } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-sidebar-header',
    styleUrl: './sidebar-header.component.css',
    templateUrl: './sidebar-header.component.html',
})
export class SidebarHeaderComponent {
    // Reçoit l'état d'ouverture depuis le parent
    isOpen = input.required<boolean>();
}
