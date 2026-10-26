import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { EnumsDataService } from '../../../../core/enums/service/enums-data.service';
import { EnumsDynamicPipe } from '../../../../core/enums/pipe/enums-dynamic.pipe';
import { RoleEnum, type IUserDto, type IUserPayload } from '../../models/user.model';

@Component({
    selector: 'app-user-table',
    imports: [TableModule, InputText, FormsModule, Select, ButtonModule, Tag, ConfirmPopup, RouterLink, EnumsDynamicPipe],
    providers: [EnumsDynamicPipe],
    templateUrl: './user-table.component.html',
    styleUrl: './user-table.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableComponent implements OnInit {
    readonly userService = inject(UserService);
    readonly toasterService = inject(ToasterService);
    readonly confirmationService = inject(ConfirmationService);
    readonly permissionService = inject(PermissionService);
    readonly enumsData = inject(EnumsDataService);
    readonly enumsPipe = inject(EnumsDynamicPipe);
    readonly destroyRef = inject(DestroyRef);

    // Pour gérer l'annulation de l'édition (rollback)
    clonedUsers: Record<string, IUserDto> = {};

    readonly rolesOptions = computed(() => {
        const backendRoles = this.enumsData.enumsData()?.roles;
        const rolesList = backendRoles ? Object.values(backendRoles) : Object.values(RoleEnum);
        return rolesList.map((roleValue) => ({
            label: this.enumsPipe.transform(roleValue, 'roles'),
            value: roleValue,
        }));
    });

    ngOnInit(): void {
        if (this.userService.users().length === 0) {
            this.userService.loadUsers();
        }
    }

    /**
     * Lors de l'initialisation de l'édition d'une ligne, on clone l'utilisateur
     */
    onRowEditInit(user: IUserDto): void {
        this.clonedUsers[user.id] = { ...user };
    }

    /**
     * Lors de la sauvegarde de l'édition, on calcule le delta et on envoie le PATCH
     */
    onRowEditSave(user: IUserDto): void {
        const original = this.clonedUsers[user.id];
        if (!original) return;

        const payload: Partial<IUserPayload> = {};
        if (user.firstname !== original.firstname) payload.firstname = user.firstname;
        if (user.lastname !== original.lastname) payload.lastname = user.lastname;
        if (user.email !== original.email) payload.email = user.email;
        if (user.phone !== original.phone) payload.phone = user.phone;
        if (user.role !== original.role) payload.role = user.role;

        if (Object.keys(payload).length === 0) {
            delete this.clonedUsers[user.id];
            return;
        }

        this.userService
            .patchUser(user.id, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.toasterService.success('Mise à jour réussie', `Le profil de ${user.firstname} ${user.lastname} a été mis à jour.`);
                    delete this.clonedUsers[user.id];
                },
                error: () => {
                    this.onRowEditCancel(user, -1);
                },
            });
    }

    /**
     * En cas d'annulation, on restaure les données d'origine et on libère le clone
     */
    onRowEditCancel(user: IUserDto, index: number): void {
        if (this.clonedUsers[user.id]) {
            this.userService.rollbackUserUpdate(index, this.clonedUsers[user.id]);
            delete this.clonedUsers[user.id];
        }
    }

    /**
     * Confirmation de suppression avec le popup PrimeNG
     */
    onDelete(event: Event, id: string): void {
        event.stopPropagation();
        this.confirmationService.confirm({
            target: event.target!,
            message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
            accept: () => {
                this.userService
                    .deleteUser(id)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: () => {
                            this.toasterService.success('Suppression réussie', "L'utilisateur a bien été retiré de la base.");
                        },
                    });
            },
        });
    }
}
