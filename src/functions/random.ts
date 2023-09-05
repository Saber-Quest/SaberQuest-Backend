import { randomInt } from "crypto";

export function createRandomToken() {
    let token = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        token += characters.charAt(randomInt(characters.length));
    }
    return token;
}

export function createRandomState() {
    let state = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.";
    for (let i = 0; i < 30; i++) {
        state += characters.charAt(randomInt(characters.length));
    }
    return state;
}