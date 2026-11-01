import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { UserService } from '../../services/user.service';
import { IUserPayload } from '../../models/user.model';

@Component({
    selector: 'app-user-create',
    standalone: true,
    imports: [PageCardWrapperComponent, UserFormComponent],
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateComponent {
    private readonly userService = inject(UserService);
    private readonly toaster = inject(ToasterService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    onCreate(payload: IUserPayload): void {
        this.userService
            .createUser(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (newUser) => {
                    void this.router.navigate(['/utilisateurs/rechercher']).then(() => {
                        this.toaster.success('Succès', `${newUser.firstname} ${newUser.lastname} a été ajouté avec succès.`);
                    });
                },
            });
    }

    onCancel(): void {
        void this.router.navigate(['/utilisateurs/rechercher']);
    }
}
