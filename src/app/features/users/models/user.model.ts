import { IAddressDto, IAddressPayload } from '../../../shared/models/address.model';
import { type Role } from '../../../core/enums/role.enum';
export { RoleEnum, type Role } from '../../../core/enums/role.enum';

export interface IUserDto {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    birthdate: string;
    enabled: boolean;
    role: Role;
    createdAt: string;
    updatedAt: string;
    address?: IAddressDto;
}

export interface IUserPayload {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
    birthdate: string;
    role: Role;
    address?: IAddressPayload;
}

export interface IUserUpdatePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
