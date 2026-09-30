import React, { useState } from "react";

import {
    Modal,
    Form,
    Input,
    Button,
    message,
} from "antd";

import api from "../api/axios";

const ModalCrearCatalogo = ({
    open,
    onClose,
    tipo,
    onCreated,
}) => {
    const [guardando, setGuardando] = useState(false);

    const configuracion = {
        enfermedad: {
            titulo: "Nueva enfermedad",
            endpoint: "catalogos/enfermedades/",
            placeholder: "Ej: Diabetes",
        },

        alergia: {
            titulo: "Nueva alergia",
            endpoint: "catalogos/alergias/",
            placeholder: "Ej: Penicilina",
        },

        medicamento: {
            titulo: "Nuevo medicamento",
            endpoint: "catalogos/medicinas/",
            placeholder: "Ej: Ibuprofeno",
        },
    };

    const config = configuracion[tipo];

    const crear = async (values) => {

        if (!config) {
            return;
        }

        try {
            setGuardando(true);

            const response = await api.post(
                config.endpoint,
                {
                    nombre: values.nombre.trim(),
                }
            );

            message.success(
                `${config.titulo} creada correctamente`
            );

            if (onCreated) {
                await onCreated(response.data);
            }

            onClose();
        } catch (error) {
            console.error(
                "Error creando catálogo:",
                error
            );

            const mensaje =
                error?.response?.data?.nombre?.[0] ||
                error?.response?.data?.detail ||
                "No se pudo crear el registro";

            message.error(mensaje);
        } finally {
            setGuardando(false);
        }
    };
    console.log(
    "ModalCrearCatalogo:",
    {
        open,
        tipo,
        config,
    }
);
    if (!config) {
        return null;
    }

    return (
        <Modal
            open={open}
            title={config.titulo}
            onCancel={onClose}
            destroyOnHidden
            footer={null}
            getContainer={document.body}
        >
            <Form
                layout="vertical"
                onFinish={crear}
            >
                <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese el nombre",
                        },
                        {
                            min: 2,
                            message:
                                "Debe tener al menos 2 caracteres",
                        },
                    ]}
                >
                    <Input
                        placeholder={config.placeholder}
                        autoFocus
                    />
                </Form.Item>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                    }}
                >
                    <Button
                        onClick={onClose}
                        disabled={guardando}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={guardando}
                    >
                        Crear
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalCrearCatalogo;