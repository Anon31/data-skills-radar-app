import { IUserDto } from '../../users/models/user.model';

/**
 * Utilisé pour typer la session courante sans stocker d'informations sensibles.
 */
export type IAuthUser = Pick<IUserDto, 'id' | 'email' | 'firstname' | 'lastname' | 'role'>;

export interface ILoginDto {
    access_token: string;
    message: string;
    user: IAuthUser;
}

export interface ILoginPayload {
    email: string;
    password: string;
}
