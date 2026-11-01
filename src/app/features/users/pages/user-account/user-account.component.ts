import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { UserFormPasswordComponent } from '../../components/user-form-password/user-form-password.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { IUserDto, IUserPayload, IUserUpdatePasswordPayload } from '../../models/user.model';

@Component({
    selector: 'app-user-account',
    standalone: true,
    providers: [DialogService],
    imports: [PageCardWrapperComponent, UserFormComponent],
    templateUrl: './user-account.component.html',
    styleUrl: './user-account.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountComponent {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);
    private readonly toaster = inject(ToasterService);
    private readonly dialogService = inject(DialogService);
    private readonly destroyRef = inject(DestroyRef);

    private dialogRef: DynamicDialogRef | null = null;

    readonly fullUserProfile = signal<IUserDto | null>(null);

    constructor() {
        effect(() => {
            const authUserId = this.authService.userConnected()?.id;
            if (authUserId && authUserId !== 'guest') {
                this.userService
                    .getUserById(authUserId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((user) => this.fullUserProfile.set(user));
            }
        });
    }

    onUpdateProfile(payload: IUserPayload): void {
        const userId = this.authService.userConnected()?.id;
        if (!userId || userId === 'guest') return;

        this.userService
            .patchUser(userId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (updatedUser) => {
                    this.fullUserProfile.set(updatedUser);
                    this.toaster.success('Succès', 'Vos informations ont été mises à jour.');
                },
            });
    }

    openPasswordDialog(): void {
        this.dialogRef = this.dialogService.open(UserFormPasswordComponent, {
            header: 'Modification du mot de passe',
            width: '26rem',
            modal: true,
            closable: true,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw',
            },
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
        });

        this.dialogRef?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((passwordPayload: IUserUpdatePasswordPayload | undefined) => {
            if (passwordPayload) {
                this.onChangePassword(passwordPayload);
            }
        });
    }

    onCancel(): void {
        void this.router.navigate(['/tableau-de-bord']);
    }

    private onChangePassword(passwordPayload: IUserUpdatePasswordPayload): void {
        this.userService
            .updateMyPassword(passwordPayload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.toaster.success('Sécurité', 'Votre mot de passe a été mis à jour avec succès.');
                },
            });
    }
}
