const DEFAULT_HASH_LENGTH: number = 7 ;
const POOL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const randomHash = (length: number = DEFAULT_HASH_LENGTH): string => {
    let result: string = '';

    for (let i = 0; i < length; i++) {
        const randomIdx = Math.random() * POOL.length;
        const randomChar = POOL[Math.floor(randomIdx)]
        result += randomChar;
    }

    return result;
}
