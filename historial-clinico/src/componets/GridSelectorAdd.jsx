import React from "react";
import { Form, Row, Col, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const GridSelectorAdd = ({ 
    name, 
    label, 
    placeholder, 
    options, 
    onAddClick, 
    required = true,
    mode = "multiple"
}) => {
    return (
        <Form.Item label={label} required={required} style={{ marginBottom: 0 }}>
            <Row gutter={8} align="middle" style={{ marginBottom: 24 }}>
                <Col flex="auto">
                    <Form.Item 
                        name={name} 
                        rules={[{ required: required, message: `Por favor, seleccione ${label.toLowerCase()}` }]}
                        style={{ margin: 0 }}
                    >
                        <Select 
                            mode={mode} 
                            placeholder={placeholder}
                            options={options}
                            style={{ width: "100%" }}
                            showSearch
                            optionFilterProp="label" // Permite buscar escribiendo el nombre
                        />
                    </Form.Item>
                </Col>
                <Col flex="none">
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        style={{ background: "#3b82f6", borderColor: "#3b82f6" }}
                        onClick={onAddClick}
                    />
                </Col>
            </Row>
        </Form.Item>
    );
};

export default GridSelectorAdd;