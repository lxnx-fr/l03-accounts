import axios from "axios";

export const apiURL = "https://strapi.l03.dev/"
export const loginState = () => {
    const dLoginDate = getData("user.loginDate");
    const dToken = getData("user.token");
    if (dLoginDate && dToken) {
        const loginDate = new Date(parseInt(dLoginDate));
        const between = loginDate.getTime() - Date.now();
        if (between <= 10000) {
            removeData("user.token");
            removeData("user.loginDate")
            return false;
        } else {
            return true;
        }
    }
};

export const getData = (key: string) => {
    return window.localStorage.getItem(key);
}
export const setData = (key: string, data: any) => {
    window.localStorage.setItem(key, data);
}
export const removeData = (key: string) => {
    window.localStorage.removeItem(key);
}
