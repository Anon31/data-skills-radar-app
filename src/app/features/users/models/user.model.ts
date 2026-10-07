import { IAddressDto, IAddressPayload } from '../../../shared/models/address.model';

export type Role = 'ADMIN' | 'USER' | 'VISITOR';

export interface IUserDto {
    id: number;
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
    role: string;
    address?: IAddressPayload;
}

export interface IUserUpdatePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
