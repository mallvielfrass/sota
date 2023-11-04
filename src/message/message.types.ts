export interface MessageResponse {
    dialogId: string;
    userId: string;
    type: string;
    text: string;
    media: string[];
    atCreated: Date;
    atEdited: Date;
    originalText: string;
    //  Id: string;
    cId: number;
    isMyMessage: boolean;
}
export enum MessageType {
    user = 'user',
    service = 'service',
}
