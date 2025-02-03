declare module '@garmin-fit/sdk' {
    export class Decoder {
        constructor(stream: Stream);
        read(options: any): { messages: any; errors: any };
    }

    export class Stream {
        constructor(buffer: Buffer);
    }
}