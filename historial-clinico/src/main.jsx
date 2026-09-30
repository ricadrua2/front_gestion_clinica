import React from "react";
import ReactDOM from "react-dom/client";

import 'antd/dist/reset.css'; // Para Ant Design v5+


import App from "./App";
import { AuthProvider } from "./auth/authContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);