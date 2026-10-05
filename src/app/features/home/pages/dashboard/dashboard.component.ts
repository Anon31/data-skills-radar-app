import { PermissionService } from '../../../../core/services/permission.service';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-dashboard',
    imports: [ButtonModule],
    templateUrl: 'dashboard.component.html',
    styleUrl: 'dashboard.component.css',
})
export class DashboardComponent {
    public readonly permissionService = inject(PermissionService);
}
