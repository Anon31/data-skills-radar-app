import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { UserService } from '../../services/user.service';
import { IUserDto, IUserPayload } from '../../models/user.model';

@Component({
    selector: 'app-user-editing',
    standalone: true,
    imports: [PageCardWrapperComponent, UserFormComponent],
    templateUrl: './user-editing.component.html',
    styleUrl: './user-editing.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditingComponent {
    private readonly userService = inject(UserService);
    private readonly toaster = inject(ToasterService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    // L'ID (UUID) est injecté depuis l'URL /utilisateurs/compte/:id via withComponentInputBinding()
    readonly id = input<string>();

    // Utilisateur en cours d'édition
    readonly loadedUser = signal<IUserDto | null>(null);

    constructor() {
        effect(() => {
            const currentId = this.id();
            if (currentId) {
                this.userService
                    .getUserById(currentId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (user) => this.loadedUser.set(user),
                        error: () => {
                            void this.router.navigate(['/utilisateurs/rechercher']);
                        },
                    });
            }
        });
    }

    onUpdate(payload: IUserPayload): void {
        const userId = this.loadedUser()?.id;
        if (!userId) return;

        this.userService
            .patchUser(userId, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (updatedUser) => {
                    void this.router.navigate(['/utilisateurs/rechercher']).then(() => {
                        this.toaster.success('Mise à jour réussie', `Le profil de ${updatedUser.firstname} ${updatedUser.lastname} a été modifié.`);
                    });
                },
            });
    }

    onCancel(): void {
        void this.router.navigate(['/utilisateurs/rechercher']);
    }
}
