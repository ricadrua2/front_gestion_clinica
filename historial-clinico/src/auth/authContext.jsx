import { createContext, useContext, useState } from "react";
import * as auth from "./auth";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUserState] = useState(auth.getUser());
    const [loading, setLoading] = useState(false);

    const signIn = async (loginData) => {
    console.log("RESPUESTA LOGIN:", loginData);
    console.log("ACCESS:", loginData?.access);
    console.log("REFRESH:", loginData?.refresh);

    auth.login(loginData);

    console.log(
        "TOKEN GUARDADO:",
        localStorage.getItem("access_token")
    );

    try {
        const response = await api.get("usuarios/me/");

        console.log("USUARIO:", response.data);

        auth.setUser(response.data);
        setUserState(response.data);

        return response.data;
    } catch (error) {
        console.error("ERROR /ME:", error.response?.data);
        console.error("STATUS:", error.response?.status);
        throw error;
    }
};

    const signOut = () => {
        auth.logout();
        setUserState(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signOut,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);