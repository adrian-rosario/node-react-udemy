import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// take scrypt callback based function
// and use promisify so we can use hanve a
// promise based implementaion, and can use async/await
const scryptAsyncPromise = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    // take plaintext password, hash it
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsyncPromise(password, salt, 64)) as Buffer;

    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");

    const buffer = (await scryptAsyncPromise(
      suppliedPassword,
      salt,
      64
    )) as Buffer;

    return buffer.toString("hex") === hashedPassword;
  }
}
