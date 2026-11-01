import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { InputPassword } from 'primeng/inputpassword';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { EnumsDataService } from '../../../../core/enums/service/enums-data.service';
import { EnumsDynamicPipe } from '../../../../core/enums/pipe/enums-dynamic.pipe';
import { IUserDto, IUserPayload, Role, RoleEnum, UserFormMode } from '../../models/user.model';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, Divider, InputPassword, InputText, Select, NgClass],
    providers: [EnumsDynamicPipe],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly enumsPipe = inject(EnumsDynamicPipe);
    private readonly enumsData = inject(EnumsDataService);

    // --- SIGNALS INPUTS ---
    readonly mode = input<UserFormMode>('create');
    readonly userData = input<IUserDto | null>(null);

    // --- SIGNALS OUTPUTS ---
    readonly save = output<IUserPayload>();
    readonly cancelClick = output<void>();
    readonly requestPasswordChange = output<void>();

    readonly rolesOptions = computed(() => {
        const backendRoles = this.enumsData.enumsData()?.roles;
        const rolesList = backendRoles ? Object.values(backendRoles) : Object.values(RoleEnum);
        return rolesList.map((roleValue) => ({
            label: this.enumsPipe.transform(roleValue, 'roles'),
            value: roleValue,
        }));
    });

    readonly userForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        phone: ['', [Validators.pattern(/^\d{10}$/)]],
        birthdate: ['', [Validators.required]],
        role: [RoleEnum.USER as Role, [Validators.required]],
        address: this.fb.group({
            number: [''],
            street: [''],
            postalCode: [''],
            city: [''],
            country: ['France'],
        }),
    });

    constructor() {
        effect(() => {
            const user = this.userData();
            const currentMode = this.mode();

            if (currentMode !== 'create') {
                this.userForm.controls.password.clearValidators();
                this.userForm.controls.password.updateValueAndValidity();
            } else {
                this.userForm.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
                this.userForm.controls.password.updateValueAndValidity();
            }

            if (user) {
                const formattedDate = user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '';

                this.userForm.patchValue({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phone: user.phone ?? '',
                    birthdate: formattedDate,
                    role: user.role,
                    address: {
                        number: user.address?.number ?? '',
                        street: user.address?.street ?? '',
                        postalCode: user.address?.postalCode ?? '',
                        city: user.address?.city ?? '',
                        country: user.address?.country ?? 'France',
                    },
                });
            }

            // Verrouillage des champs critiques en mode "Mon Compte" (edit-self)
            if (currentMode === 'edit-self') {
                this.userForm.controls.firstname.disable();
                this.userForm.controls.lastname.disable();
                this.userForm.controls.email.disable();
                this.userForm.controls.birthdate.disable();
                this.userForm.controls.password.disable();
            } else {
                this.userForm.controls.firstname.enable();
                this.userForm.controls.lastname.enable();
                this.userForm.controls.email.enable();
                this.userForm.controls.birthdate.enable();
                this.userForm.controls.password.enable();
            }
        });
    }

    onSubmit(): void {
        const addrControls = this.userForm.controls.address.controls;
        const hasAddressInput = Boolean(
            addrControls.number.value.trim() ||
            addrControls.street.value.trim() ||
            addrControls.postalCode.value.trim() ||
            addrControls.city.value.trim(),
        );

        // Si l'utilisateur a commencé à renseigner une adresse, l'API exige number, street, postalCode, city et country
        if (hasAddressInput) {
            addrControls.number.setValidators([Validators.required]);
            addrControls.street.setValidators([Validators.required]);
            addrControls.postalCode.setValidators([Validators.required]);
            addrControls.city.setValidators([Validators.required]);
            addrControls.country.setValidators([Validators.required]);
        } else {
            addrControls.number.clearValidators();
            addrControls.street.clearValidators();
            addrControls.postalCode.clearValidators();
            addrControls.city.clearValidators();
            addrControls.country.clearValidators();
        }
        addrControls.number.updateValueAndValidity();
        addrControls.street.updateValueAndValidity();
        addrControls.postalCode.updateValueAndValidity();
        addrControls.city.updateValueAndValidity();
        addrControls.country.updateValueAndValidity();

        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const formValue = this.userForm.getRawValue();

        const payload: IUserPayload = {
            firstname: formValue.firstname.trim(),
            lastname: formValue.lastname.trim(),
            email: formValue.email.trim(),
            ...(formValue.password ? { password: formValue.password } : {}),
            ...(formValue.phone.trim() ? { phone: formValue.phone.trim() } : {}),
            birthdate: formValue.birthdate,
            role: formValue.role,
            ...(hasAddressInput
                ? {
                      address: {
                          number: formValue.address.number.trim(),
                          street: formValue.address.street.trim(),
                          postalCode: formValue.address.postalCode.trim(),
                          city: formValue.address.city.trim(),
                          country: formValue.address.country.trim() || 'France',
                      },
                  }
                : {}),
        };

        this.save.emit(payload);
    }
}
