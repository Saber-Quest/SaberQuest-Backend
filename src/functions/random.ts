export function createRandomToken() {
    let token = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

export function createRandomState() {
    let state = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.";
    for (let i = 0; i < 30; i++) {
        state += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return state;
}