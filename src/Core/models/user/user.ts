export default interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    isActive?: boolean;
    isGuest?: boolean;
    createdDate?: Date;
    updatedDate?: Date;
}
