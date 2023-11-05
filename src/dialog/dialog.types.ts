export enum DialogType {
    private = 'private',
    public = 'public',
    closed = 'closed',
    self = 'self',
}
export interface dialogResponse {
    _id: string;
    chatType: string;
    name: string;
    msgCount: number;
    readedMessage: number;
    owner: string;
}
