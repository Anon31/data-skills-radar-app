import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [LoginFormComponent, ButtonModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private readonly router = inject(Router);

    public showLoginForm = signal<boolean>(false);

    public toggleForm(): void {
        this.showLoginForm.update((value) => !value);
    }

    public visitAsGuest(): void {
        this.router.navigate(['/tableau-de-bord']);
    }
}
