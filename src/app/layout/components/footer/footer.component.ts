import { SystemService } from '../../../core/services/system.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { Chip } from 'primeng/chip';

@Component({
    imports: [Chip],
    selector: 'app-footer',
    styleUrl: './footer.component.css',
    templateUrl: './footer.component.html',
})
export class FooterComponent {
    private systemService = inject(SystemService);

    public systemData = toSignal(this.systemService.getSystemStatus(), {
        initialValue: {
            environment: '...',
            vaultSecured: false,
            version: '...',
            timestamp: '',
        },
    });
}
