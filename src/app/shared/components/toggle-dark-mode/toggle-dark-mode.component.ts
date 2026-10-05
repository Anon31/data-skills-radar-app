import { SessionService } from '../../../core/services/session.service';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-toggle-dark-mode',
    imports: [ButtonModule],
    templateUrl: './toggle-dark-mode.component.html',
})
export class ToggleDarkModeComponent {
    public sessionService = inject(SessionService);
}
