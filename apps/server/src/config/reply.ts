export type Reply = {
    type : 'text' | 'image';
    imageBuffer? : Buffer;
    content : string;
}