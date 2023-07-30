import crypto from "node:crypto";

const algorithm = process.env.ALGORITHM;
const password = process.env.ENCRYPTION_KEY;
const buffer = Buffer.from(password);

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, buffer, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text: string): string | null {
  try {
    const textParts = text.split(":");
    const shift = String(textParts.shift());

    const iv = Buffer.from(shift, "hex");

    const encryptedText = Buffer.from(textParts.join(":"), "hex");

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(password),
      iv,
    );

    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decrypted.toString();
  } catch (err) {
    return null;
  }
}

export { encrypt, decrypt };