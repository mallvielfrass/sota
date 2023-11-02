export enum DialogType {
    private = 'private',
    public = 'public',
    closed = 'closed',
}
export interface dialogResponse {
    _id: string;
    chatType: DialogType;
    name: string;
}
