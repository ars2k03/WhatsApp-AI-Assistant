import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";

export const pcmToOgg = (pcmBuffer: Buffer): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const input = new PassThrough();
        const chunks: Buffer[] = [];

        ffmpeg(input)
            .inputFormat("s16le")
            .inputOptions(["-ar 24000", "-ac 1"])
            .audioCodec("libopus")
            .format("ogg")
            .on("error", reject)
            .pipe(new PassThrough())
            .on("data", (chunk) => chunks.push(chunk))
            .on("end", () => resolve(Buffer.concat(chunks)));

        input.end(pcmBuffer);
    });
};