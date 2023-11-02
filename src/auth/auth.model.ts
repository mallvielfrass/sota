export interface UserResponse {
    success: boolean;
    user: {
        email: string;
        _id: string;
        //  hash: string;
    };
}
