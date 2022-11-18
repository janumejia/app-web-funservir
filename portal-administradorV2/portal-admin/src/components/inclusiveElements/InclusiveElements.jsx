import React, { useState, useEffect } from 'react';
import axios from "axios";
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, message, AutoComplete } from 'antd';


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Introduzca ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const ManageElements = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        axios.get('http://localhost:4000/elements')
            .then((res) => {
                setData(res.data);
            }).catch((error) => console.error(error));
    }, [])

    const isEditing = (record) => record._id === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const saveEdit = async (key) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item._id);
            const item = newData[index];

            if (key === "0" && row.name !== " " && row.desc !== " ") {
                const newElement = {
                    name: row.name,
                    desc: row.desc
                }
                axios.post('http://localhost:4000/addElement', newElement)
                    .then((res) => {
                        newData.splice(index, 1, res.data.element);
                        setData(newData);
                        setEditingKey('');
                        message.success('Se ha creado el Elemento Inclusivo exitosamente');
                    })
                    .catch((error) => {
                        message.error('No se ha podido crear el Elemento Inclusivo');
                    });
            } else if (key !== "0") {

                axios.post('http://localhost:4000/editElement', { ...item, ...row })
                    .then((res) => {
                        newData.splice(index, 1, res.data);
                        setData(newData);
                        setEditingKey('');
                        message.success('Se editó el Elemento Inclusivo exitosamente');
                    })
                    .catch((error) => {
                        message.error('No se ha podido modificar el Elemento Inclusivo');
                    });
            } else {
                message.warning('¡Debes completar todos los campos obligatorios!');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item._id);
        if (key !== "0") {
            axios.post('http://localhost:4000/deleteElement', { _id: key })
                .then((res) => {
                    newData.splice(index, 1);
                    setData(newData);
                    message.success('Se ha eliminado el Elemento Inclusivo exitosamente');
                })
                .catch((error) => {
                    message.error('No se ha podido eliminar el Elemento Inclusivo');
                });
        } else {
            newData.splice(index, 1);
            setData(newData);
            message.success('Se ha eliminado el Elemento Inclusivo exitosamente');
        }
    };

    const columns = [
        {
            title: 'Nombre*',
            dataIndex: "name",
            key: "name",
            width: '20%',
            editable: true,
            filteredValue: [searchedText],
            onFilter: (value, record) => {
                return String(record.name).toLocaleLowerCase().includes(value.toLocaleLowerCase()) 
                || String(record.desc).toLocaleLowerCase().includes(value.toLocaleLowerCase());
            }
        },
        {
            title: 'Descripción*',
            dataIndex: 'desc',
            key: "desc",
            width: '70%',
            editable: true,
        },
        {
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            keyboard
                            onClick={() => saveEdit(record._id)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Guardar
                        </Typography.Link>
                        <Popconfirm title="¿Estás seguro?" cancelText="Cancelar" onConfirm={cancel}>
                            <Typography.Link keyboard type="danger">
                                Cancelar
                            </Typography.Link>
                        </Popconfirm>
                    </span>
                ) : (
                    <Space size="middle">
                        <Typography.Link keyboard disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>
                        <Popconfirm title="¿Estás seguro?" cancelText="Cancelar" onConfirm={() => handleDelete(record._id)}>
                            <Typography.Link keyboard type="danger">
                                Eliminar
                            </Typography.Link>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    const handleAdd = () => {
        const index = data.findIndex((item) => "0" === item._id);
        if (index === -1) {
            const newElement = {
                _id: "0",
                name: " ",
                desc: " ",
            };
            setData([...data, newElement]);
            edit(newElement);
        } else {
            message.error('Ya se encuentra creando un Elemento Inclusivo. Finalice la creación o elimine el registro añadido');
        }
    };

    return (
        <Form form={form} component={false}>
            <Space align="start" wrap={true}>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
                size='large'
            >
                Añadir Elemento Inclusivo
            </Button>
                <AutoComplete
                    dropdownMatchSelectWidth={252}
                    style={{
                        width: 300
                    }}
                /*options={options}
                onSelect={onSelect}
                onSearch={handleSearch}*/
                >
                    <Input.Search size='large' 
                    placeholder="Buscar..." 
                    enterButton
                    onSearch={(value)=>{
                        setSearchedText(value);
                    }}
                    />
                </AutoComplete>
                
                </Space>
                <Table
                    rowKey={record => record._id}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
        </Form>
    );
};

export default ManageElements;