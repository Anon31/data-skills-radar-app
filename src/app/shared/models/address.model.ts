export interface IAddressDto {
    id: string;
    number?: string;
    street?: string;
    city?: string;
    zipcode?: string;
    state?: string;
    userId: string;
}

export type IAddressPayload = Omit<IAddressDto, 'id' | 'userId'>;
