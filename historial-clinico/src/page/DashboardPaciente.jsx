import React from "react";
import { Typography, Card, Result } from "antd";

const { Title, Text } = Typography;

export const DashboardTemplate = () => {
    return (
        <div style={{ 
            minHeight: "100vh", 
            backgroundColor: "#0f172a", 
            padding: "40px 24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Card style={{ 
                background: "rgba(255, 255, 255, 0.01)", 
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "16px",
                maxWidth: "500px",
                width: "100%"
            }}>
                <Result
                    status="info"
                    title={<span style={{ color: "#f8fafc" }}>Módulo en Construcción</span>}
                    subTitle={<span style={{ color: "#94a3b8" }}>Este panel estará disponible próximamente con la información de tu cuenta.</span>}
                />
            </Card>
        </div>
    );
};

// Dejamos el export default para que no falle ninguna importación en tus rutas
export default DashboardTemplate;