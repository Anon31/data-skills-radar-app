export interface IAddressDto {
    id: string;
    number: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    userId: string;
}

export type IAddressPayload = Omit<IAddressDto, 'id' | 'userId'>;
