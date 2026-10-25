export enum RoleEnum {
    ADMIN = 'ADMIN',
    USER = 'USER',
    VISITOR = 'VISITOR',
}

export type Role = RoleEnum | `${RoleEnum}`;
