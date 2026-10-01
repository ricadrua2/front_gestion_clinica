import { Button, Card, Form, Input, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../auth/authContext";
import "./login.css";
import { useNavigate } from "react-router-dom"; // <
import api from "../api/axios";

const { Title, Text } = Typography;

export const Login = () => {
    const { signIn } = useAuth();
const navigate = useNavigate();

const onFinish = async (values) => {
    try {
        const response = await api.post("usuarios/login/", {
            username: values.username,
            password: values.password,
        });

        console.log("RESPUESTA LOGIN:", response.data);

        const user = await signIn(response.data);

        console.log("USUARIO AUTENTICADO:", user);

       if (user.groups?.includes(1)) {
            navigate("/medico");
        } else if (user.groups?.includes(2)) {
            navigate("/medico");
        } else {
            message.error("El usuario no tiene un grupo válido");
        }
    }catch (error) {
    console.error("Error en el login:", error);

    const data = error.response?.data;

    if (data?.non_field_errors?.length) {
        message.error(data.non_field_errors[0]);
        return;
    }

    message.error("Ocurrió un error al iniciar sesión");
}
};// 2. CORRECCIÓN: Se quitó el ';' extra que rompía el flujo

    return (
        <div className="login-container">
            <div className="wave-bg wave-1"></div>
            <div className="wave-bg wave-2"></div>

            {/* 3. CORRECCIÓN: Cambiado bordered por variant para AntD v5 */}
            <Card className="login-card" variant="none">
                <div className="login-header">
                    <Title level={2} className="login-title">Bienvenido</Title>
                    <Text className="login-subtitle">Ingresa tus credenciales para continuar</Text>
                </div>

                <Form
                    name="login_form"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
                    >
                        <Input 
                            prefix={<UserOutlined className="site-form-item-icon" />} 
                            placeholder="Usuario" 
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Contraseña"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" block>
                            Iniciar Sesión
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;