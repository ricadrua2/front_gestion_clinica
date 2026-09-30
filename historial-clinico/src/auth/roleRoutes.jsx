import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

export default function RoleRoute({ roles, children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.groups?.some((group) => roles.includes(group))) {
        return <Navigate to="/403" replace />;
    }

    return children;
}