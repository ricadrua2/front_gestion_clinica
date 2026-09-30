import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../page/login";
import CitasScreen from "../page/citasScreen";
import DashboardAdmin from "../page/DashboardAdmin";
import DashboardMedico from "../page/DashboardMedico";
import DashboardLayout from "../layout/DashboardLayout";

import ProtectedRoute from "../auth/protecteRouters";
import RoleRoute from "../auth/roleRoutes";

import UsuariosScreen from "../page/crear_usuario";


export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ADMIN */}

                <Route
                    path="/admin"
                    element={

                        <ProtectedRoute>

                            <RoleRoute roles={["ADMIN"]}>

                                <DashboardAdmin />

                            </RoleRoute>

                        </ProtectedRoute>

                    }
                />


                {/* LAYOUT DEL MÉDICO */}

                <Route
                    element={

                        <ProtectedRoute>

                            <RoleRoute roles={[1,2]}>

                                <DashboardLayout />

                            </RoleRoute>

                        </ProtectedRoute>

                    }
                >

                    <Route
                        path="/medico"
                        element={
                            <DashboardMedico />
                        }
                    />

                    <Route
                        path="/usuarios"
                        element={
                            <UsuariosScreen />
                        }
                    />

                    {/* HISTORIA CLÍNICA */}

                    <Route
                        path="/historia-clinica/:pacienteId"
                        element={
                            <CitasScreen />
                        }
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}