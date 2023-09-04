import * as fs from "fs";

export async function createBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
}

export function downloadAvatar(buffer: Buffer, id: string): void {
    fs.writeFileSync(`./data/avatars/${id}.png`, buffer);
}

export async function compareAvatars(url: string, id: string): Promise<void> {
    const buffer = await createBuffer(url);
    const file = fs.readFileSync(`./data/avatars/${id}.png`);
    if (file.toString() !== buffer.toString()) {
        downloadAvatar(buffer, id);
    }
}