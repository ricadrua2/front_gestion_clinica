import React, { useState, useEffect } from "react";

import {
    Card,
    Table,
    Button,
    Input,
    Space,
    Typography,
    Tag
} from "antd";

import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";

const { Title } = Typography;
import ModalUsuario from "../componets/ModalCrearUsuario";
export default function UsuariosScreen() {

    const [buscar, setBuscar] = useState("");
    const [modalUsuario, setModalUsuario] = useState(false);  
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const usuarios = [
        {
            id: 1,
            nombre: "Ricardo",
            apellido: "Rua",
            cedula: "1143562789",
            rol: "Administrador",
            iglesia: "Misión Caribe",
            estado: true
        },
        {
            id: 2,
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "1002456879",
            rol: "Médico",
            iglesia: "Misión Caribe",
            estado: false
        }
    ];
    const iglesias = [
    {
        value: 1,
        label: "Misión Caribe"
    },
    {
        value: 2,
        label: "Iglesia Central"
    },
    {
        value: 3,
        label: "Iglesia Norte"
    }
];
    const columnas = [

        {
            title: "Nombre",
            render: (_, record) =>
                `${record.nombre} ${record.apellido}`
        },

        {
            title: "Cédula",
            dataIndex: "cedula"
        },

        {
            title: "Rol",
            dataIndex: "rol"
        },

        {
            title: "Iglesia",
            dataIndex: "iglesia"
        },

        {
            title: "Estado",

            render: (_, record) =>

                record.estado ?

                    <Tag color="green">
                        Activo
                    </Tag>

                    :

                    <Tag color="red">
                        Inactivo
                    </Tag>

        },

        {
            title: "Acciones",

            width: 160,

            render: (_, record) => (

                <Space>

                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {

                            setUsuarioEditar(null);

                            setModalUsuario(true);

                        }}
                    />

                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                    />

                </Space>

            )

        }

    ];
    const guardarUsuario = (usuario) => {

            if (usuario.id) {

                console.log("Actualizar usuario", usuario);

                // Aquí irá el PUT

            } else {

                console.log("Crear usuario", usuario);

                // Aquí irá el POST

            }

            setModalUsuario(false);

            setUsuarioEditar(null);

        };
    useEffect(() => {

        }, []);
    return (

        <div
            style={{
                padding: 20
            }}
        >

            <Card

                style={{

                    borderRadius: 18,

                    background: "#1e293b",

                    border: "1px solid #334155"

                }}

            >

                {/* CABECERA */}

                <div

                    style={{

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                        marginBottom: 25,

                        flexWrap: "wrap",

                        gap: 15

                    }}

                >

                    <Title

                        level={3}

                        style={{

                            color: "white",

                            margin: 0

                        }}

                    >

                        Gestión de Usuarios

                    </Title>


                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => setModalUsuario(true)}
                    >
                        Nuevo Usuario
                    </Button>

                </div>


                {/* BUSCADOR */}

                <Input

                    allowClear

                    size="large"

                    prefix={<SearchOutlined />}

                    placeholder="Buscar por nombre o cédula"

                    value={buscar}

                    onChange={(e) =>
                        setBuscar(e.target.value)
                    }

                    style={{
                        marginBottom: 20
                    }}

                />


                {/* TABLA */}

                <Table

                    rowKey="id"

                    columns={columnas}

                    dataSource={usuarios}

                    pagination={{
                        pageSize: 8
                    }}

                />
                <ModalUsuario
                    open={modalUsuario}
                    onClose={() => {

                        setModalUsuario(false);

                        setUsuarioEditar(null);

                    }}
                    usuario={usuarioEditar}
                    onSave={guardarUsuario}
                    iglesias={iglesias}
                />

            </Card>

        </div>

    );

}