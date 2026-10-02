import { Layout, Menu, Typography, Button,Grid  } from "antd";
import { useEffect, useState } from "react";
import {
    UserAddOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, 
    TeamOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const { Text } = Typography;

export default function DashboardLayout() {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);

    const esMovil = !screens.lg;

    useEffect(() => {
        if (screens.lg !== undefined) {
            setCollapsed(!screens.lg);
        }
    }, [screens.lg]);

    return (
        <Layout style={{ minHeight: "100vh" }}>

            {esMovil && collapsed && (
                <Button
                    type="primary"
                    icon={<MenuUnfoldOutlined />}
                    onClick={() => setCollapsed(false)}
                    style={{
                        position: "fixed",
                        top: 16,
                        left: 16,
                        zIndex: 10000,
                        width: 45,
                        height: 45,
                        borderRadius: 8,
                    }}
                />
            )}

            <Sider
                collapsible
                trigger={null}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                collapsedWidth={0}
                width={esMovil ? 220 : 240}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: esMovil ? "fixed" : "sticky",
                    left: 0,
                    top: 0,
                    zIndex: 9999,
                    scrollbarWidth: "thin",
                    scrollbarGutter: "stable",
                }}
            >

                {/* ZONA SUPERIOR DEL MENÚ */}
                {esMovil && (
                    <div
                        style={{
                            height: 60,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingRight: 10,
                        }}
                    >
                        <Button
                            type="text"
                            icon={<MenuFoldOutlined />}
                            onClick={() => setCollapsed(true)}
                            style={{
                                color: "#fff",
                                fontSize: 20,
                                width: 42,
                                height: 42,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.10)",
                                borderRadius: 8,
                            }}
                        />
                    </div>
                )}


                {/* Logo */}
                <div
                    style={{
                        height: 40,
                        margin: 16,
                        background:
                            "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                    >
                        HOSPITAL CONTROL
                    </Text>
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    style={{
                        background: "#1e293b",
                        border: "none",
                    }}
                    items={[
                        {
                            key: "1",
                            icon: <UserAddOutlined />,
                            label: "Citas Médicas",
                            onClick: () => navigate("/medico"),
                        },                      
                        
                        {
                            type: "divider",
                        },
                        {
                            key: "4",
                            icon: (
                                <LogoutOutlined
                                    style={{ color: "#ef4444" }}
                                />
                            ),
                            label: (
                                <span style={{ color: "#ef4444" }}>
                                    Cerrar Sesión
                                </span>
                            ),
                            onClick: () => navigate("/login"),
                        },
                    ]}
                />
            </Sider>

            <Layout
                style={{
                width: "100%",
                minWidth: 0,
            }}>
                <Content
                     style={{
                    padding: esMovil ? 12 : 24,
                    background: "#0f172a",
                    minHeight: "100vh",
                    width: "100%",
                    overflowX: "hidden",
                    boxSizing: "border-box",
                }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}