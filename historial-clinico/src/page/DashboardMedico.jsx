import { useEffect, useState } from "react";

import {
    Layout,
    Card,
    Tag,
    Button,
    Row,
    Col,
    Input,
    Space,
    Typography,
    Avatar,
    message,
    Spin,
    Empty,
} from "antd";

import {
    SearchOutlined,
    FolderOpenOutlined,
    UserOutlined,
    UserAddOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import api from "../api/axios";

import ModalCitaMedica from "../componets/ModalCitaMedica";

const { Content } = Layout;
const { Title, Text } = Typography;

const DashboardMedico = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const esMedico = user?.groups?.includes(1);

    const [pacientes, setPacientes] = useState([]);
    const [documento, setDocumento] = useState("");

    const [loading, setLoading] = useState(true);
    const [buscando, setBuscando] = useState(false);

    const [busquedaSinResultados, setBusquedaSinResultados] =
        useState(false);

    // Modal de atención médica
    const [modalCitaOpen, setModalCitaOpen] = useState(false);

    // ==========================================
    // CARGAR PACIENTES
    // ==========================================

    const cargarPacientes = async () => {
        try {
            setLoading(true);

            const response = await api.get("usuarios/pacientes/");

            setPacientes(response.data.results || []);
        } catch (error) {
            console.error(error);

            message.error("No se pudieron cargar los pacientes");

            setPacientes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPacientes();
    }, []);

    // ==========================================
    // BUSCAR PACIENTE
    // ==========================================

    const buscarPaciente = async () => {
        const documentoLimpio = documento.trim();

        if (!documentoLimpio) {
            message.warning("Ingrese un número de documento");
            return;
        }

        try {
            setBuscando(true);
            setBusquedaSinResultados(false);

            const response = await api.get(
                `usuarios/pacientes/?documento=${documentoLimpio}`
            );

            const resultados = response.data.results || [];

            setPacientes(resultados);

            if (resultados.length === 0) {
                setBusquedaSinResultados(true);

                message.warning(
                    "No se encontró ningún paciente con ese documento"
                );
            }
        } catch (error) {
            console.error(error);

            setPacientes([]);
            setBusquedaSinResultados(true);

            message.error("No se pudo realizar la búsqueda");
        } finally {
            setBuscando(false);
        }
    };

    // ==========================================
    // LIMPIAR BÚSQUEDA
    // ==========================================

    const limpiarBusqueda = () => {
        setDocumento("");
        setBusquedaSinResultados(false);

        cargarPacientes();
    };

    // ==========================================
    // HISTORIA CLÍNICA
    // ==========================================

    const abrirHistoriaClinica = (pacienteId) => {
        navigate(`/historia-clinica/${pacienteId}`);
    };

    // ==========================================
    // ABRIR MODAL CREAR ATENCIÓN
    // ==========================================

    const agregarUsuario = () => {
        setModalCitaOpen(true);
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <Layout
            style={{
                minHeight: "100vh",
                background: "#0f172a",
            }}
        >
            <Content style={{ padding: 24 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 24,
                        flexWrap: "wrap",
                    }}
                >
                    <Title
                        level={2}
                        style={{
                            color: "#f8fafc",
                            margin: 0,
                        }}
                    >
                        Pacientes
                    </Title>

                    {esMedico && (
                        <Button
                            type="primary"
                            icon={<UserAddOutlined />}
                            onClick={() => setModalCitaOpen(true)}
                        >
                            Crear cita médica
                        </Button>
                    )}
                </div>
                {/* ======================================
                    BUSCADOR
                ======================================= */}

                {esMedico && (
                    <Card
                        style={{
                            background: "#1e293b",
                            border: "none",
                            marginBottom: 24,
                        }}
                    >
                        <Space.Compact
                            style={{
                                width: "100%",
                            }}
                        >
                            <Input
                                size="large"
                                placeholder="Buscar paciente por documento..."
                                prefix={<SearchOutlined />}
                                value={documento}
                                inputMode="numeric"
                                onKeyDown={(e) => {
                                    if (
                                        !/[0-9]/.test(e.key) &&
                                        ![
                                            "Backspace",
                                            "Delete",
                                            "ArrowLeft",
                                            "ArrowRight",
                                            "Tab",
                                            "Enter",
                                        ].includes(e.key)
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const valor = e.target.value;

                                    if (!/^\d*$/.test(valor)) {
                                        return;
                                    }

                                    setDocumento(valor);
                                    setBusquedaSinResultados(false);
                                }}
                                onPressEnter={buscarPaciente}
                            />

                            <Button
                                type="primary"
                                size="large"
                                loading={buscando}
                                onClick={buscarPaciente}
                            >
                                Buscar
                            </Button>

                            {documento && (
                                <Button
                                    size="large"
                                    onClick={limpiarBusqueda}
                                >
                                    Limpiar
                                </Button>
                            )}
                        </Space.Compact>
                    </Card>
                )}

                {/* ======================================
                    CARGANDO
                ======================================= */}

                {loading && (
                    <Card
                        style={{
                            background: "#1e293b",
                            border:
                                "1px solid rgba(255,255,255,0.05)",
                            marginBottom: 24,
                            textAlign: "center",
                        }}
                    >
                        <Spin size="large" />

                        <div
                            style={{
                                marginTop: 16,
                                color: "#94a3b8",
                            }}
                        >
                            Cargando pacientes...
                        </div>
                    </Card>
                )}

                {/* ======================================
                    PACIENTE NO ENCONTRADO
                ======================================= */}

                {!loading && busquedaSinResultados && (
                    <Card
                        style={{
                            background: "#1e293b",
                            border:
                                "1px solid rgba(255,255,255,0.05)",
                            marginBottom: 24,
                        }}
                    >
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span
                                    style={{
                                        color: "#94a3b8",
                                    }}
                                >
                                    No existe un paciente con el documento{" "}
                                    <strong
                                        style={{
                                            color: "#f8fafc",
                                        }}
                                    >
                                        {documento}
                                    </strong>
                                </span>
                            }
                        >
                            <Button
                                type="primary"
                                icon={<UserAddOutlined />}
                                onClick={agregarUsuario}
                            >
                                Agregar usuario
                            </Button>
                        </Empty>
                    </Card>
                )}

                {/* ======================================
                    NO HAY PACIENTES REGISTRADOS
                ======================================= */}

                {!loading &&
                    !busquedaSinResultados &&
                    pacientes.length === 0 && (
                        <Card
                            style={{
                                background: "#1e293b",
                                border:
                                    "1px solid rgba(255,255,255,0.05)",
                                marginBottom: 24,
                            }}
                        >
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span
                                        style={{
                                            color: "#94a3b8",
                                        }}
                                    >
                                        No hay pacientes registrados
                                    </span>
                                }
                            >
                                <Button
                                    type="primary"
                                    icon={<UserAddOutlined />}
                                    onClick={agregarUsuario}
                                >
                                    Agregar usuario
                                </Button>
                            </Empty>
                        </Card>
                    )}

                {/* ======================================
                    LISTADO DE PACIENTES
                ======================================= */}

                {!loading &&
                    !busquedaSinResultados &&
                    pacientes.length > 0 && (
                        <Row gutter={[16, 16]}>
                            {pacientes.map((paciente) => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    lg={8}
                                    xl={6}
                                    key={paciente.id}
                                >
                                    <Card
                                        style={{
                                            height: "100%",
                                            background: "#1e293b",
                                            border:
                                                "1px solid rgba(255,255,255,0.05)",
                                            borderRadius: 12,
                                        }}
                                    >
                                        <Space
                                            align="start"
                                            style={{
                                                width: "100%",
                                                marginBottom: 16,
                                            }}
                                        >
                                            <Avatar
                                                size={55}
                                                icon={<UserOutlined />}
                                            />

                                            <div>
                                                <Title
                                                    level={4}
                                                    style={{
                                                        color: "#f8fafc",
                                                        margin: 0,
                                                    }}
                                                >
                                                    {paciente.nombre}{" "}
                                                    {paciente.apellido}
                                                </Title>

                                                <Text
                                                    style={{
                                                        color: "#38bdf8",
                                                    }}
                                                >
                                                    CC:{" "}
                                                    {paciente.cedula}
                                                </Text>
                                            </div>
                                        </Space>

                                        <Space wrap>
                                            {paciente.edad && (
                                                <Tag color="blue">
                                                    {paciente.edad} años
                                                </Tag>
                                            )}

                                            {paciente.sexo && (
                                                <Tag color="purple">
                                                    {paciente.sexo}
                                                </Tag>
                                            )}

                                            {paciente.tipo_sangre && (
                                                <Tag color="red">
                                                    {paciente.tipo_sangre}
                                                </Tag>
                                            )}

                                            {paciente.eps && (
                                                <Tag color="green">
                                                    {paciente.eps}
                                                </Tag>
                                            )}
                                        </Space>

                                        <Button
                                            type="primary"
                                            icon={
                                                <FolderOpenOutlined />
                                            }
                                            block
                                            style={{
                                                marginTop: 20,
                                            }}
                                            onClick={() =>
                                                abrirHistoriaClinica(
                                                    paciente.id
                                                )
                                            }
                                        >
                                            Ver Historia Clínica
                                        </Button>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                {/* ======================================
                    MODAL CITA MÉDICA
                ======================================= */}

                <ModalCitaMedica
                    isOpen={modalCitaOpen}
                    onClose={() => setModalCitaOpen(false)}
                    onSave={(data) => {
                        console.log("Atención médica:", data);

                        setModalCitaOpen(false);

                        cargarPacientes();
                    }}
                    bancoEnfermedades={[]}
                    bancoMedicinas={[]}
                />
            </Content>
        </Layout>
    );
};

export default DashboardMedico;