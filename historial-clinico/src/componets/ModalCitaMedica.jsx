import React, { useEffect, useState } from "react";

import {
    Modal,
    Form,
    Input,
    Button,
    message,
    Divider,
    Card,
    Typography,
    Row,
    Col,
    Select,
    InputNumber,
} from "antd";

import {
    SearchOutlined,
} from "@ant-design/icons";

import api from "../api/axios";
import ModalCrearCatalogo from "../componets/ModalCrearCAtalogo";

const { Title, Text } = Typography;

const ModalCitaMedica = ({
    isOpen,
    onClose,
    documentoInicial = "",
    pacienteInicial = null,
}) => {

    const [formCita] = Form.useForm();
    const [formPaciente] = Form.useForm();

    const [paciente, setPaciente] = useState(null);
    const [mostrarPacienteNuevo, setMostrarPacienteNuevo] =useState(false);

    const [buscandoPaciente, setBuscandoPaciente] =useState(false);

    const [guardando, setGuardando] =useState(false);

    const [modalCatalogoOpen, setModalCatalogoOpen] =useState(false);

    const [tipoCatalogo, setTipoCatalogo] =useState(null);

    const [iglesias, setIglesias] =useState([]);

    const [alergias, setAlergias] =useState([]);

    const [enfermedades, setEnfermedades] =useState([]);

    const [medicinas, setMedicinas] =useState([]);

    const [cedulaNuevoPaciente, setCedulaNuevoPaciente] =useState("");

    const [cargandoCatalogos, setCargandoCatalogos] =useState(false);
    // ==============================
    // ABRIR MODAL DE CATÁLOGO
    // ==============================

    const abrirModalCatalogo = (tipo) => {
        setTipoCatalogo(tipo);
        setModalCatalogoOpen(true);
    };
    
    const guardarCita = async (data) => {
        try {
            
            const response = await api.post(
                "citas/",
                data
            );

            console.log(
                "RESPUESTA:",
                response.data
            );

            message.success(
                "Cita médica registrada correctamente"
            );

            return response.data;
        } catch (error) {
            console.error(
                "ERROR DEL POST:",
                error
            );

            console.error(
                "RESPUESTA BACKEND:",
                error.response?.data
            );

            message.error(
                error.response?.data?.detail ||
                "No se pudo registrar la cita"
            );

            throw error;
        }
    };

    // ==============================
    // CATÁLOGO CREADO
    // ==============================

    const catalogoCreado = async () => {
        await cargarCatalogos();
    };

    // ==============================
    // CARGAR CATÁLOGOS
    // ==============================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        cargarCatalogos();
    }, [isOpen]);

    //=========================
    //=======================nuevo useEffect
    useEffect(() => {
            if (!isOpen) {
                return;
            }

            if (pacienteInicial) {
                setPaciente(pacienteInicial);
                setMostrarPacienteNuevo(false);
            }
        }, [
            isOpen,
            pacienteInicial,
        ]);
    //=========================


    const cargarCatalogos = async () => {
        try {
            setCargandoCatalogos(true);

            const [
                iglesiasResponse,
                alergiasResponse,
                enfermedadesResponse,
                medicinasResponse,
            ] = await Promise.all([
                api.get("catalogos/iglesias/"),
                api.get("catalogos/alergias/"),
                api.get("catalogos/enfermedades/"),
                api.get("catalogos/medicinas/"),
            ]);

            setIglesias(
                iglesiasResponse.data.results ||
                iglesiasResponse.data
            );

            setAlergias(
                alergiasResponse.data.results ||
                alergiasResponse.data
            );

            setEnfermedades(
                enfermedadesResponse.data.results ||
                enfermedadesResponse.data
            );

            setMedicinas(
                medicinasResponse.data.results ||
                medicinasResponse.data
            );
        } catch (error) {
            console.error(
                "Error cargando catálogos:",
                error
            );

            message.error(
                "No se pudieron cargar los datos del formulario"
            );
        } finally {
            setCargandoCatalogos(false);
        }
    };

    // ==============================
    // BUSCAR PACIENTE
    // ==============================

    const buscarPaciente = async (documento) => {
        const documentoLimpio = documento?.trim();

        if (!documentoLimpio) {
            message.warning(
                "Ingrese un número de documento"
            );

            return;
        }

        try {
            setBuscandoPaciente(true);

            const response = await api.get(
                `usuarios/pacientes/?documento=${documentoLimpio}`
            );

            const resultados = response.data.results || [];

            if (resultados.length > 0) {
                const pacienteEncontrado = resultados[0];

                setPaciente(pacienteEncontrado);
                setMostrarPacienteNuevo(false);

                message.success(
                    "Paciente encontrado"
                );
            } else {
                setPaciente(null);
                setCedulaNuevoPaciente(documentoLimpio);
                setMostrarPacienteNuevo(true);

                message.warning(
                    "No se encontró el paciente. Puede registrarlo."
                );
            }
        } catch (error) {
            console.error(error);

            message.error(
                "No se pudo buscar el paciente"
            );
        } finally {
            setBuscandoPaciente(false);
        }
    };

    // ==============================
    // CONTINUAR CON PACIENTE NUEVO
    // ==============================

    const continuarConPacienteNuevo = async () => {
        try {
            const values = await formPaciente.validateFields();
            console.log("DATOS DEL FORMULARIO PACIENTE:", values);

            setPaciente(values);
            setMostrarPacienteNuevo(false);

            message.success(
                "Datos del paciente registrados"
            );
        } catch (error) {
            console.log(
                "Faltan campos del paciente"
            );
        }
    };

    // ==============================
    // GUARDAR CITA
    // ==============================

    const guardarAtencion = async () => {
        try {
            const citaValues =
                await formCita.validateFields();

            if (!paciente) {
                message.warning(
                    "Primero debe seleccionar o registrar un paciente"
                );

                return;
            }

            let pacienteData;

            if (paciente.id) {
                pacienteData = {
                    id: paciente.id,
                };
            } else {
                pacienteData = {
                    cedula: paciente.cedula,
                    nombre: paciente.nombre,
                    apellido: paciente.apellido,
                     telefono: paciente.telefono || null,
                    fk_iglesia: paciente.fk_iglesia || null,
                    tipo_sangre: paciente.tipo_sangre || null,
                    eps: paciente.eps || null,
                    edad: paciente.edad || null,
                    sexo: paciente.sexo || null,
                    peso: paciente.peso || null,
                    altura: paciente.altura || null,
                    estado_sivil:
                        paciente.estado_sivil || null,
                    alergias:
                        paciente.alergias || [],
                    enfermedades:
                        paciente.enfermedades || [],
                    medicamentos_actuales:
                        paciente.medicamentos_actuales || [],
                };
            }

            const data = {
                paciente: pacienteData,

                cita: {
                    fk_medicina:
                        citaValues.fk_medicina || [],

                    fk_enfermedad:
                        citaValues.fk_enfermedad || [],

                    estado_de_ingreso:
                        citaValues.estado_de_ingreso || "",

                    recomendaciones:
                        citaValues.recomendaciones || "",
                },
            };

            console.log(
                "JSON que se va a enviar:",
                data
            );

            setGuardando(true);

            await guardarCita(data);

            cerrarModal();
        } catch (error) {
            console.error(
                "Error guardando la cita:",
                error
            );

            message.error(
                "No se pudo guardar la cita"
            );
        } finally {
            setGuardando(false);
        }
    };

    // ==============================
    // CERRAR MODAL
    // ==============================

    const cerrarModal = () => {
        setModalCatalogoOpen(false);
        setTipoCatalogo(null);

        onClose();

        formCita.resetFields();
        formPaciente.resetFields();

        setPaciente(null);
        setMostrarPacienteNuevo(false);
        setCedulaNuevoPaciente("");
    };

    // ==============================
    // OPTIONS
    // ==============================

    const opcionesIglesias = iglesias.map(
        (iglesia) => ({
            value: iglesia.id,
            label: iglesia.nombre,
        })
    );

    const opcionesAlergias = alergias.map(
        (alergia) => ({
            value: alergia.id,
            label: alergia.nombre,
        })
    );

    const opcionesEnfermedades =
        enfermedades.map(
            (enfermedad) => ({
                value: enfermedad.id,
                label: enfermedad.nombre,
            })
        );

    const opcionesMedicinas =
        medicinas.map(
            (medicina) => ({
                value: medicina.id,
                label: medicina.nombre,
            })
        );
    

    return (
        <>
            <Modal
                open={isOpen}
                onCancel={cerrarModal}
                width={900}
                footer={null}
                destroyOnHidden
                centered
                getContainer={() => document.body}
            >
                
                <Title level={3}>
                    Nueva cita médica
                </Title>

                {/* ==========================================
                    BUSCAR PACIENTE
                ========================================== */}

                {!paciente &&
                    !mostrarPacienteNuevo && (
                        <Card>
                            <Title level={4}>
                                Buscar paciente
                            </Title>

                            <Input.Search
                                size="large"
                                placeholder="Número de documento"
                                prefix={
                                    <SearchOutlined />
                                }
                                enterButton="Buscar"
                                loading={
                                    buscandoPaciente
                                }
                                defaultValue={
                                    documentoInicial
                                }
                                onSearch={
                                    buscarPaciente
                                }
                            />
                        </Card>
                    )}

                {/* ==========================================
                    PACIENTE EXISTENTE
                ========================================== */}

                {paciente?.id && (
                    <Card>
                        <Title level={4}>
                            Paciente seleccionado
                        </Title>

                        <Text strong>
                            Nombre:
                        </Text>{" "}
                        {paciente.nombre_completo ||
                            `${paciente.nombre || ""} ${paciente.apellido || ""}`.trim()}

                        <br />

                        <Text strong>
                            Documento:
                        </Text>{" "}
                        {paciente.documento || paciente.cedula}

                        <br />

                        <Button
                            style={{
                                marginTop: 15,
                            }}
                            onClick={() => {
                                setPaciente(null);
                                formCita.resetFields();
                            }}
                        >
                            Cambiar paciente
                        </Button>
                    </Card>
                )}

                {/* ==========================================
                    PACIENTE NUEVO
                ========================================== */}

                {mostrarPacienteNuevo && (
                    <Card>
                        <Title level={4}>
                            Registrar paciente
                        </Title>

                        <Form
                            form={formPaciente}
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Cédula"
                                        name="cedula"
                                        initialValue={
                                            cedulaNuevoPaciente
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                <Form.Item
                                    label="Teléfono"
                                    name="telefono"
                                >
                                    <Input
                                        placeholder="Ej: 3001234567"
                                        inputMode="numeric"
                                    />
                                </Form.Item>
                            </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Nombre"
                                        name="nombre"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Ingrese el nombre",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Apellido"
                                        name="apellido"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Ingrese el apellido",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                {/* IGLESIA */}

                                <Col span={12}>
                                    <Form.Item
                                        label="Iglesia"
                                        name="fk_iglesia"
                                    >
                                        <Select
                                            showSearch
                                            loading={
                                                cargandoCatalogos
                                            }
                                            placeholder="Seleccione una iglesia"
                                            optionFilterProp="label"
                                            options={
                                                opcionesIglesias
                                            }
                                        />
                                    </Form.Item>
                                </Col>

                                {/* TIPO SANGRE */}

                                <Col span={8}>
                                    <Form.Item
                                        label="Tipo de sangre"
                                        name="tipo_sangre"
                                    >
                                        <Select
                                            placeholder="Seleccione"
                                            options={[
                                                {
                                                    value: "A+",
                                                    label: "A+",
                                                },
                                                {
                                                    value: "A-",
                                                    label: "A-",
                                                },
                                                {
                                                    value: "B+",
                                                    label: "B+",
                                                },
                                                {
                                                    value: "B-",
                                                    label: "B-",
                                                },
                                                {
                                                    value: "AB+",
                                                    label: "AB+",
                                                },
                                                {
                                                    value: "AB-",
                                                    label: "AB-",
                                                },
                                                {
                                                    value: "O+",
                                                    label: "O+",
                                                },
                                                {
                                                    value: "O-",
                                                    label: "O-",
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* SEXO */}

                                <Col span={8}>
                                    <Form.Item
                                        label="Sexo"
                                        name="sexo"
                                    >
                                        <Select
                                            placeholder="Seleccione"
                                            options={[
                                                {
                                                    value: "M",
                                                    label: "Masculino",
                                                },
                                                {
                                                    value: "F",
                                                    label: "Femenino",
                                                },
                                                {
                                                    value: "O",
                                                    label: "Otro",
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* EDAD */}

                                <Col span={8}>
                                    <Form.Item
                                        label="Edad"
                                        name="edad"
                                    >
                                        <InputNumber
                                            min={0}
                                            max={120}
                                            style={{
                                                width: "100%",
                                            }}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* EPS */}

                                <Col span={12}>
                                    <Form.Item
                                        label="EPS"
                                        name="eps"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                {/* ESTADO CIVIL */}

                                <Col span={12}>
                                    <Form.Item
                                        label="Estado civil"
                                        name="estado_sivil"
                                    >
                                        <Select
                                            placeholder="Seleccione"
                                            options={[
                                                {
                                                    value: "SOLTERO",
                                                    label: "Soltero/a",
                                                },
                                                {
                                                    value: "CASADO",
                                                    label: "Casado/a",
                                                },
                                                {
                                                    value: "DIVORCIADO",
                                                    label: "Divorciado/a",
                                                },
                                                {
                                                    value: "VIUDO",
                                                    label: "Viudo/a",
                                                },
                                                {
                                                    value: "UNION_LIBRE",
                                                    label: "Unión Libre",
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* PESO */}

                                <Col span={12}>
                                    <Form.Item
                                        label="Peso (kg)"
                                        name="peso"
                                    >
                                        <InputNumber
                                            min={0}
                                            step={0.01}
                                            style={{
                                                width: "100%",
                                            }}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* ALTURA */}

                                <Col span={12}>
                                    <Form.Item
                                        label="Altura (m)"
                                        name="altura"
                                    >
                                        <InputNumber
                                            min={0}
                                            max={3}
                                            step={0.01}
                                            precision={2}
                                            style={{
                                                width: "100%",
                                            }}
                                            placeholder="Ej: 1.75"
                                        />
                                    </Form.Item>
                                </Col>

                                {/* ALERGIAS */}

                                <Col span={24}>
                                    <Form.Item
                                        label="Alergias"
                                        name="alergias"
                                    >
                                        <Select
                                            mode="multiple"
                                            showSearch
                                            loading={
                                                cargandoCatalogos
                                            }
                                            placeholder="Seleccione las alergias"
                                            optionFilterProp="label"
                                            options={
                                                opcionesAlergias
                                            }
                                        />
                                    </Form.Item>

                                    <Button
                                        type="link"
                                        onClick={() =>
                                            abrirModalCatalogo(
                                                "alergia"
                                            )
                                        }
                                    >
                                        Nueva alergia
                                    </Button>
                                </Col>

                                {/* ENFERMEDADES */}

                                <Col span={24}>
                                    <Form.Item
                                        label="Enfermedades"
                                        name="enfermedades"
                                    >
                                        <Select
                                            mode="multiple"
                                            showSearch
                                            loading={
                                                cargandoCatalogos
                                            }
                                            placeholder="Seleccione las enfermedades"
                                            optionFilterProp="label"
                                            options={
                                                opcionesEnfermedades
                                            }
                                        />
                                    </Form.Item>

                                    <Button
                                        type="link"
                                        onClick={() =>
                                            abrirModalCatalogo(
                                                "enfermedad"
                                            )
                                        }
                                    >
                                        Nueva enfermedad
                                    </Button>
                                </Col>

                                {/* MEDICAMENTOS ACTUALES */}

                                <Col span={24}>
                                    <Form.Item
                                        label="Medicamentos actuales"
                                        name="medicamentos_actuales"
                                    >
                                        <Select
                                            mode="multiple"
                                            showSearch
                                            loading={
                                                cargandoCatalogos
                                            }
                                            placeholder="Seleccione los medicamentos"
                                            optionFilterProp="label"
                                            options={
                                                opcionesMedicinas
                                            }
                                        />
                                    </Form.Item>

                                    <Button
                                        type="link"
                                        onClick={() =>
                                            abrirModalCatalogo(
                                                "medicamento"
                                            )
                                        }
                                    >
                                        Nuevo medicamento
                                    </Button>
                                </Col>
                            </Row>

                            <Divider />

                            <Button
                                type="primary"
                                onClick={
                                    continuarConPacienteNuevo
                                }
                            >
                                Continuar
                            </Button>
                        </Form>
                    </Card>
                )}

                {/* ==========================================
                    DATOS DE LA CITA
                ========================================== */}

                {paciente &&
                    !mostrarPacienteNuevo && (
                        <>
                            <Divider />

                            <Card>
                                <Title level={4}>
                                    Información de la cita
                                </Title>

                                <Form
                                    form={formCita}
                                    layout="vertical"
                                >
                                    <Row gutter={16}>
                                        {/* ENFERMEDADES DE LA CITA */}

                                        <Col span={24}>
                                            <Form.Item
                                                label="Enfermedades / diagnóstico"
                                                name="fk_enfermedad"
                                            >
                                                <Select
                                                    mode="multiple"
                                                    showSearch
                                                    loading={
                                                        cargandoCatalogos
                                                    }
                                                    placeholder="Seleccione las enfermedades"
                                                    optionFilterProp="label"
                                                    options={
                                                        opcionesEnfermedades
                                                    }
                                                />
                                            </Form.Item>

                                            <Button
                                                type="link"
                                                onClick={() =>
                                                    abrirModalCatalogo(
                                                        "enfermedad"
                                                    )
                                                }
                                            >
                                                Nueva enfermedad
                                            </Button>
                                        </Col>

                                        {/* MEDICAMENTOS DE LA CITA */}

                                        <Col span={24}>
                                            <Form.Item
                                                label="Medicamentos"
                                                name="fk_medicina"
                                            >
                                                <Select
                                                    mode="multiple"
                                                    showSearch
                                                    loading={
                                                        cargandoCatalogos
                                                    }
                                                    placeholder="Seleccione los medicamentos"
                                                    optionFilterProp="label"
                                                    options={
                                                        opcionesMedicinas
                                                    }
                                                />
                                            </Form.Item>

                                            <Button
                                                type="link"
                                                onClick={() =>
                                                    abrirModalCatalogo(
                                                        "medicamento"
                                                    )
                                                }
                                            >
                                                Nuevo medicamento
                                            </Button>
                                        </Col>

                                        {/* ESTADO */}

                                        <Col span={24}>
                                            <Form.Item
                                                label="Estado de ingreso"
                                                name="estado_de_ingreso"
                                            >
                                                <Input.TextArea
                                                    rows={3}
                                                    placeholder="Describa el estado de ingreso del paciente"
                                                />
                                            </Form.Item>
                                        </Col>

                                        {/* RECOMENDACIONES */}

                                        <Col span={24}>
                                            <Form.Item
                                                label="Recomendaciones"
                                                name="recomendaciones"
                                            >
                                                <Input.TextArea
                                                    rows={4}
                                                    placeholder="Escriba las recomendaciones"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Button
                                        type="primary"
                                        onClick={
                                            guardarAtencion
                                        }
                                        loading={guardando}
                                    >
                                        Guardar cita
                                    </Button>
                                </Form>
                            </Card>
                        </>
                    )}
            </Modal>

            {/* ==========================================
                MODAL PARA CREAR CATÁLOGOS
                DEBE ESTAR FUERA DEL MODAL PRINCIPAL
            ========================================== */}

            <ModalCrearCatalogo
                open={modalCatalogoOpen}
                onClose={() => {
                    setModalCatalogoOpen(false);
                    setTipoCatalogo(null);
                }}
                tipo={tipoCatalogo}
                onCreated={catalogoCreado}
            />
        </>
    );
};

export default ModalCitaMedica;