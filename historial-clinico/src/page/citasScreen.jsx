import {
    Card,
    Avatar,
    Row,
    Col,
    Tag,
    Space,
    Divider,
    Typography,
    Spin,
    Alert,
    Empty,
    Button
} from "antd";

import {
    UserOutlined,
    PhoneOutlined,
    MedicineBoxOutlined,
    HeartOutlined,
    DownOutlined,
    UpOutlined
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import {
    useParams
} from "react-router-dom";
import api from "../api/axios";
import ModalCitaMedica from "../componets/ModalCitaMedica";
import { useAuth } from "../auth/authContext";
const { Title, Text, Paragraph } = Typography;


export default function CitasScreen() {

    const {
        pacienteId
    } = useParams();

    const [
    modalCitaOpen,
    setModalCitaOpen,
] = useState(false);

    const [pacienteAbierto, setPacienteAbierto] = useState(
        window.innerWidth > 768
    );

    const [paciente, setPaciente] = useState(null);

    const [citasData, setCitasData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const { user } = useAuth();

    
    const esMedico = user?.groups?.some(
        (group) => Number(group) === 1
    );
    console.log("USUARIO:", user);
    console.log("GROUPS:", user?.groups);
    console.log("ES MEDICO:", esMedico);

    useEffect(() => {

        const cargarHistoriaClinica = async () => {

            try {

                setLoading(true);

                setError(null);

                const response = await api.get(
                    `/citas/paciente/${pacienteId}/`
                );

                setPaciente(
                    response.data.paciente
                );

                setCitasData(
                    response.data.citas
                );

            } catch (error) {

                console.error(
                    "Error cargando historia clínica:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "No se pudo cargar la historia clínica."
                );

            } finally {

                setLoading(false);

            }

        };


        if (pacienteId) {
            cargarHistoriaClinica();
        }

    }, [pacienteId]);


    if (loading) {

        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "300px"
                }}
            >
                <Spin size="large" />
            </div>
        );

    }


    if (error) {

        return (
            <div style={{ padding: 20 }}>
                <Alert
                    type="error"
                    message="Error"
                    description={error}
                    showIcon
                />
            </div>
        );

    }


    if (!paciente) {

        return (
            <div style={{ padding: 20 }}>
                <Empty
                    description="No se encontró información del paciente"
                />
            </div>
        );

    }


    return (

        <div
            style={{
                padding: 20
            }}
        >

            {/* PANEL PACIENTE */}

            <Card
                className="patient-header"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 999,

                    marginBottom: 25,

                    borderRadius: 18,

                    background:
                        "linear-gradient(135deg,#172554,#1e3a8a)",

                    border: "none",

                    boxShadow:
                        "0 10px 30px rgba(0,0,0,.25)"
                }}
            >

                {/* CABECERA */}

                <div
                    onClick={() =>
                        setPacienteAbierto(
                            !pacienteAbierto
                        )
                    }
                    style={{
                        cursor: "pointer",

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                        color: "white",

                        marginBottom:
                            pacienteAbierto
                                ? 20
                                : 0
                    }}
                >

                    <Space>

                        <Avatar
                            size={45}
                            icon={<UserOutlined />}
                            style={{
                                background: "#3b82f6"
                            }}
                        />

                        <div>

                            <Text
                                style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: 16
                                }}
                            >
                                {paciente.nombre}
                            </Text>
                            {esMedico && (
                            <Button
                                type="primary"
                                onClick={() => setModalCitaOpen(true)}
                            >
                                Agregar cita médica
                            </Button>
                        )}
                            <br />

                            <Text
                                style={{
                                    color: "#cbd5e1"
                                }}
                            >
                                CC {paciente.documento}
                            </Text>

                        </div>

                    </Space>


                    {
                        pacienteAbierto
                            ?
                            <UpOutlined />
                            :
                            <DownOutlined />
                    }

                </div>


                {
                    pacienteAbierto && (

                        <Row
                            gutter={[24, 24]}
                            align="middle"
                        >

                            {/* AVATAR */}

                            <Col
                                xs={24}
                                md={4}
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                <Avatar
                                    size={90}
                                    icon={<UserOutlined />}
                                    style={{
                                        background: "#3b82f6"
                                    }}
                                />

                            </Col>


                            <Col
                                xs={24}
                                md={20}
                            >

                                <Row gutter={[20, 15]}>

                                    <Col
                                        xs={24}
                                        lg={12}
                                    >

                                        <Title
                                            level={2}
                                            style={{
                                                color: "white",
                                                marginBottom: 4
                                            }}
                                        >
                                            {paciente.nombre}
                                        </Title>


                                        <Text
                                            style={{
                                                color: "#cbd5e1"
                                            }}
                                        >
                                            CC {paciente.documento}
                                        </Text>

                                    </Col>


                                    <Col
                                        xs={24}
                                        lg={12}
                                    >

                                        <Space wrap>

                                            {
                                                paciente.sangre && (
                                                    <Tag color="red">
                                                        {paciente.sangre}
                                                    </Tag>
                                                )
                                            }


                                            {
                                                paciente.eps && (
                                                    <Tag color="green">
                                                        {paciente.eps}
                                                    </Tag>
                                                )
                                            }


                                            {
                                                paciente.edad !== null &&
                                                paciente.edad !== undefined && (
                                                    <Tag color="blue">
                                                        {paciente.edad} años
                                                    </Tag>
                                                )
                                            }


                                            {
                                                paciente.genero && (
                                                    <Tag color="purple">
                                                        {paciente.genero}
                                                    </Tag>
                                                )
                                            }

                                        </Space>

                                    </Col>

                                </Row>


                                <Divider
                                    style={{
                                        borderColor: "#334155"
                                    }}
                                />


                                <Row
                                    gutter={[15, 15]}
                                >

                                    {/* TELEFONO */}

                                    {
                                        paciente.telefono && (

                                            <Col
                                                xs={24}
                                                md={12}
                                            >

                                                <Space>

                                                    <PhoneOutlined />

                                                    <Text
                                                        style={{
                                                            color: "white"
                                                        }}
                                                    >
                                                        {paciente.telefono}
                                                    </Text>

                                                </Space>

                                            </Col>

                                        )
                                    }


                                    {/* ALERGIAS */}

                                    <Col span={24}>

                                        <Title
                                            level={5}
                                            style={{
                                                color: "white",
                                                marginBottom: 8
                                            }}
                                        >
                                            Alergias
                                        </Title>


                                        <Space wrap>

                                            {
                                                paciente.alergias?.length > 0
                                                    ?
                                                    paciente.alergias.map(
                                                        (item) => (
                                                            <Tag
                                                                color="volcano"
                                                                key={item}
                                                            >
                                                                ⚠ {item}
                                                            </Tag>
                                                        )
                                                    )
                                                    :
                                                    <Text
                                                        style={{
                                                            color: "#cbd5e1"
                                                        }}
                                                    >
                                                        No registra alergias
                                                    </Text>
                                            }

                                        </Space>

                                    </Col>


                                    {/* ENFERMEDADES */}

                                    <Col span={24}>

                                        <Title
                                            level={5}
                                            style={{
                                                color: "white",
                                                marginBottom: 8
                                            }}
                                        >
                                            Enfermedades
                                        </Title>


                                        <Space wrap>

                                            {
                                                paciente.enfermedades?.length > 0
                                                    ?
                                                    paciente.enfermedades.map(
                                                        (item) => (
                                                            <Tag
                                                                color="gold"
                                                                key={item}
                                                            >
                                                                <HeartOutlined />
                                                                {" "}
                                                                {item}
                                                            </Tag>
                                                        )
                                                    )
                                                    :
                                                    <Text
                                                        style={{
                                                            color: "#cbd5e1"
                                                        }}
                                                    >
                                                        No registra enfermedades
                                                    </Text>
                                            }

                                        </Space>

                                    </Col>


                                    {/* MEDICAMENTOS ACTUALES */}

                                    <Col span={24}>

                                        <Title
                                            level={5}
                                            style={{
                                                color: "white",
                                                marginBottom: 8
                                            }}
                                        >
                                            Medicamentos actuales
                                        </Title>


                                        <Space wrap>

                                            {
                                                paciente.medicamentosActuales?.length > 0
                                                    ?
                                                    paciente.medicamentosActuales.map(
                                                        (item) => (
                                                            <Tag
                                                                color="cyan"
                                                                key={item}
                                                            >
                                                                {item}
                                                            </Tag>
                                                        )
                                                    )
                                                    :
                                                    <Text
                                                        style={{
                                                            color: "#cbd5e1"
                                                        }}
                                                    >
                                                        No registra medicamentos
                                                    </Text>
                                            }

                                        </Space>

                                    </Col>


                                    {/* INFORMACION FISICA */}

                                    <Col span={24}>

                                        <Title
                                            level={5}
                                            style={{
                                                color: "white",
                                                marginBottom: 8
                                            }}
                                        >
                                            Información física
                                        </Title>


                                        <Space wrap>

                                            {
                                                paciente.estadoCivil && (
                                                    <Tag color="cyan">
                                                        E.C.:{" "}
                                                        {paciente.estadoCivil}
                                                    </Tag>
                                                )
                                            }


                                            {
                                                paciente.estatura !== null &&
                                                paciente.estatura !== undefined && (
                                                    <Tag color="green">
                                                        Est.:{" "}
                                                        {paciente.estatura} m
                                                    </Tag>
                                                )
                                            }


                                            {
                                                paciente.peso !== null &&
                                                paciente.peso !== undefined && (
                                                    <Tag color="gold">
                                                        Peso:{" "}
                                                        {paciente.peso} kg
                                                    </Tag>
                                                )
                                            }

                                        </Space>

                                    </Col>

                                </Row>

                            </Col>

                        </Row>

                    )
                }

            </Card>


            {/* HISTORIAL DE CITAS */}

            <Title level={3}>
                Historial de citas médicas
            </Title>


            {
                citasData.length === 0 ? (

                    <Empty
                        description="El paciente no tiene citas médicas registradas"
                    />

                ) : (

                    citasData.map(
                        (cita) => (

                            <Card
                                key={cita.id}
                                style={{
                                    marginBottom: 20,
                                    borderRadius: 18,
                                    border:
                                        "1px solid #e5e7eb"
                                }}
                            >

                                <Title level={4}>
                                    Consulta del{" "}
                                    {cita.fecha}
                                </Title>


                                <Text type="secondary">
                                    Dr.{" "}
                                    {cita.doctor}
                                </Text>


                                <Divider />


                                {/* MOTIVO */}

                                <Title level={5}>
                                    Motivo de consulta
                                </Title>


                                <Paragraph>
                                    {cita.motivoConsulta ||
                                        "No registrado"}
                                </Paragraph>


                                {/* ENFERMEDADES */}

                                <Title level={5}>
                                    Enfermedades encontradas
                                </Title>


                                <Space wrap>

                                    {
                                        cita.enfermedades?.length > 0
                                            ?
                                            cita.enfermedades.map(
                                                (item) => (
                                                    <Tag
                                                        color="red"
                                                        key={item}
                                                    >
                                                        {item}
                                                    </Tag>
                                                )
                                            )
                                            :
                                            <Text type="secondary">
                                                No se registraron enfermedades
                                            </Text>
                                    }

                                </Space>


                                <Divider />


                                {/* MEDICAMENTOS */}

                                <Title level={5}>
                                    Medicamentos formulados
                                </Title>


                                {
                                    cita.medicamentos?.length > 0
                                        ?

                                        <ul>

                                            {
                                                cita.medicamentos.map(
                                                    (item) => (
                                                        <li key={item}>
                                                            {item}
                                                        </li>
                                                    )
                                                )
                                            }

                                        </ul>

                                        :

                                        <Text type="secondary">
                                            No se formularon medicamentos
                                        </Text>
                                }


                                {/* RECOMENDACIONES */}

                                <Title level={5}>
                                    Recomendaciones médicas
                                </Title>


                                <Paragraph>
                                    {cita.recomendaciones ||
                                        "No se registraron recomendaciones"}
                                </Paragraph>

                            </Card>

                        )
                    )

                )
            }
            
            <ModalCitaMedica
                    isOpen={modalCitaOpen}
                    onClose={() =>
                        setModalCitaOpen(false)
                    }
                    pacienteInicial={paciente}
                />
        </div>

    );

}