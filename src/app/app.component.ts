import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToggleDarkModeComponent } from './shared/components/toggle-dark-mode/toggle-dark-mode.component';
import { Toast } from 'primeng/toast';
import { RouterOutlet } from '@angular/router';

@Component({
    imports: [ButtonModule, ToggleDarkModeComponent, Toast, RouterOutlet],
    selector: 'app-root',
    styleUrl: './app.component.css',
    templateUrl: './app.component.html',
})
export class AppComponent {
    protected readonly title = signal('data-skills-radar-app');
}
