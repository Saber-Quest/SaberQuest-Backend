import * as fs from "fs";

export async function createBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
}

export function downloadAvatar(buffer: Buffer, id: string): void {
    if (process.env.NODE_ENV === "production") {
        fs.writeFileSync(`${process.env.PROD_PATH}../data/avatars/${id}.png`, buffer);
        return;
    }
    fs.writeFileSync(`./data/avatars/${id}.png`, buffer);
}

export function downloadBanner(buffer: Buffer, id: string, type: string): void {
    if (process.env.NODE_ENV === "production") {
        fs.writeFileSync(`${process.env.PROD_PATH}../data/banners/${type}/${id}.png`, buffer);
        return;
    }
    fs.writeFileSync(`./data/banners/${type}/${id}.png`, buffer);
}

export async function compareAvatars(url: string, id: string): Promise<void> {
    const buffer = await createBuffer(url);
    let exists: boolean;
    if (process.env.NODE_ENV === "production") {
        exists = fs.existsSync(`${process.env.PROD_PATH}../data/avatars/${id}.png`);
    } else {
        exists = fs.existsSync(`./data/avatars/${id}.png`);
    }
    if (!exists) {
        downloadAvatar(buffer, id);
        return;
    }
    let file: Buffer;

    if (process.env.NODE_ENV === "production") {
        file = fs.readFileSync(`${process.env.PROD_PATH}../data/avatars/${id}.png`);
    } else {
        file = fs.readFileSync(`./data/avatars/${id}.png`);
    }
    if (file.toString() !== buffer.toString()) {
        downloadAvatar(buffer, id);
    }
}