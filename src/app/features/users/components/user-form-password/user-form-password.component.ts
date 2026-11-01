import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputPassword } from 'primeng/inputpassword';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-user-form-password',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputPassword, NgClass],
    templateUrl: './user-form-password.component.html',
    styleUrl: './user-form-password.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormPasswordComponent {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly ref = inject(DynamicDialogRef);

    readonly passwordForm = this.fb.group({
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    onSubmit(): void {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        // Ferme la modale en renvoyant le payload au composant parent (UserAccountComponent)
        this.ref.close(this.passwordForm.getRawValue());
    }

    onCancel(): void {
        this.ref.close();
    }
}
