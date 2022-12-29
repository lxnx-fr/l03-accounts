import axios from "axios";

export const apiURL = () => { return "https://158.101.183.96/" }
export const loginState = () => {
    const dLoginDate = getData("user.loginDate");
    const dToken = getData("user.token");
    if (dLoginDate && dToken) {
        const loginDate = new Date(parseInt(dLoginDate));
        const between = loginDate.getTime() - Date.now();
        if (between <= 10000) {
            removeData("user.token");
            removeData("user.loginDate")
            console.log("Nuxt | Deleted User Data (Current Date --> Saved Date)");
            return false;
        } else {
            console.log("Nuxt | User is logged in (Saved Date --> Current Date)");
            return true;
        }
    }
};

export const loadDataFromDatabase = () => {
    const request = axios.get(apiURL() + "api/users/me", {
        headers: { Authorization: "Bearer " + getData("user.token") },
    });
    request.then((response) => {
        console.log("Nuxt | Downloading user data from database", response);
        setData("user.data", response.data);
        return true;
    });
    request.catch((response) => {
        console.log(
            "Nuxt | Error while downloading user data from database",
            response
        );
        return false;
    });
}

export const getData = (key) => {
    return window.localStorage.getItem(key);
}
export const setData = (key, data) => {
    window.localStorage.setItem(key, data);
}
export const removeData = (key) => {
    window.localStorage.removeItem(key);
}
export default {
    apiURL,
    setData,
    getData,
    removeData,
    loadDataFromDatabase,
};
