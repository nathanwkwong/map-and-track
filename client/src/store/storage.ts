export const KEY = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    CREDENTIAL: 'CREDENTIAL'
}

export const setItemSync = (key: string, data: any, isStringify: boolean = false) => {
    try {
        window.localStorage.setItem(key, isStringify ? JSON.stringify(data) : data);
        return true;
    } catch (error) {
        return false
    }
}

export const getItemSync = (key: string, defaultValue: string, isStringify: boolean = false) => {
    let data = defaultValue;
    try {
        data = window.localStorage.getItem(key) || defaultValue;
        return data = isStringify ? JSON.parse(data) : data;
    } catch (error) {
        return data
    }
}