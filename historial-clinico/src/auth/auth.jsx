const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER = "user";

export const login = (data) => {
    localStorage.setItem(ACCESS_TOKEN, data.access);
    localStorage.setItem(REFRESH_TOKEN, data.refresh);
};

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER);
};

export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
};

export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN);
};

export const setUser = (user) => {
    localStorage.setItem(USER, JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
};