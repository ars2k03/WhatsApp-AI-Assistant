import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";

export const oggToPcm = (oggBuffer: Buffer): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const input = new PassThrough();
        const chunks: Buffer[] = [];

        ffmpeg(input)
            .inputFormat("ogg")
            .audioFrequency(24000)
            .audioChannels(1)
            .audioCodec("pcm_s16le")
            .format("s16le")
            .on("error", reject)
            .pipe(new PassThrough())
            .on("data", (chunk) => chunks.push(chunk))
            .on("end", () => resolve(Buffer.concat(chunks)));

        input.end(oggBuffer);
    });
};