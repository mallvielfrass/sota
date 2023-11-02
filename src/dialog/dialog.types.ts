export enum DialogType {
    private = 'private',
    public = 'public',
    closed = 'closed',
    self = 'self',
}
export interface dialogResponse {
    _id: string;
    chatType: DialogType;
    name: string;
}
