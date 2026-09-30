import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    Radio,
    Space,
    Card,
    Switch
} from "antd";

const { Option } = Select;

export default function ModalUsuario({
    open,
    onClose,
    onSave,
    roles = [],
    usuario,
    iglesias = []
}) {

    const [form] = Form.useForm();

    const guardar = (values) => {

        onSave(values);

        form.resetFields();

    };

    useEffect(() => {

    if (open) {

        if (usuario) {

            form.setFieldsValue(usuario);

        } else {

            form.resetFields();

        }

    }

}, [usuario, open]);
    return (

        <Modal
            title={
                    usuario
                        ? "Editar Usuario"
                        : "Nuevo Usuario"
                }
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnClose
        >
            <Card
                style={{
                    borderRadius: 16
                }}
                bodyStyle={{
                    padding: 24
                }}
            >

            <Form
                form={form}
                layout="vertical"
                onFinish={guardar}
            >

            <Form
        form={form}
        layout="vertical"
        onFinish={guardar}
>

    <Row gutter={16}>

        <Col span={12}>
            <Form.Item
                name="nombre"
                label="Nombre"
                rules={[
                    {
                        required: true,
                        message: "Ingrese el nombre"
                    }
                ]}
            >
                <Input />
            </Form.Item>
        </Col>

        <Col span={12}>
            <Form.Item
                name="apellido"
                label="Apellido"
                rules={[
                    {
                        required: true,
                        message: "Ingrese el apellido"
                    }
                ]}
            >
                <Input />
            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item
                                name="cedula"
                                label="Cédula"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese la cédula"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Contraseña"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese la contraseña"
                                    }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item
                                    name="fk_rol"
                                    label="Rol"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Seleccione un rol"
                                        }
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio value={1}>
                                            Administrador
                                        </Radio>

                                        <Radio value={2}>
                                            Médico
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="fk_iglesia"
                                label="Iglesia"
                                rules={[
                                    {
                                        required: true,
                                        message: "Seleccione una iglesia"
                                    }
                                ]}
                            >
                                <Select
                                    placeholder="Seleccione la iglesia"
                                    options={iglesias}
                                />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Form.Item>

                        <Space
                            style={{
                                float: "right"
                            }}
                        >

                            <Button
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                               {
                                    usuario
                                        ? "Actualizar Usuario"
                                        : "Guardar Usuario"
                                }
                            </Button>

                        </Space>

                    </Form.Item>

                </Form>

            </Form>
           </Card>

        </Modal>

    );

}