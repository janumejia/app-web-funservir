import React, { useState, useEffect } from 'react';
import axios from "axios";
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Space } from 'antd';

/*for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}
*/
/*const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <tr {...props} />
        </Form>
    );
};*/


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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
                            message: `Please Input ${title}!`,
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


const ManageUsers = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        axios.get('http://localhost:4000/all_users')
            .then((res) => {
                setData(res.data);
            }).catch((error) => console.error(error));
    }, [data])

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
            console.log(key, 'test');
            if (index > -1 && !(key === undefined)) {

                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                console.log(item);
                axios.post('http://localhost:4000/editUser', { ...item, ...row })
                    .then((res) => {
                        setData(newData);
                        setEditingKey('');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key) => {
        const newData = data.filter((item) => item._id !== key);
        console.log(key)
        axios.post('http://localhost:4000/deleteUser', {_id:key})
        .then((res)=>{
            setData(newData);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const columns = [
        {
            title: 'Nombre*',
            dataIndex: "name",
            width: '25%',
            editable: true,
        },
        {
            title: 'Email*',
            dataIndex: "email",
            width: '20%',
            editable: true,
        },
        {
            title: 'Edad*',
            dataIndex: "edad",
            width: '10%',
            editable: true,
        },
        {
            title: 'Sexo*',
            dataIndex: "sexo",
            width: '10%',
            editable: true,
        },
        {
            title: 'Dirección*',
            dataIndex: "direccion",
            width: '40%',
            editable: true,
        },
        {
            title: 'Discapacidad',
            dataIndex: "discapacidad",
            width: '40%',
            editable: true,
        },
        {
            title: 'Tutor*',
            dataIndex: "tutor",
            width: '5%',
            editable: true,
        },
        {
            title: 'Fundación',
            dataIndex: "fundacion",
            width: '5%',
            editable: true,
        },
        {
            title: 'Rol*',
            dataIndex: "userType",
            width: '5%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
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
                        <Popconfirm title="¿Estás seguro?" onConfirm={cancel}>
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
                        <Popconfirm title="¿Estás seguro?" onConfirm={() => handleDelete(record._id)}>
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
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    //const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const handleAdd = () => {
        const newUser = {
            name: " ",
            email: " ",
            password: " ",
            edad: " ",
            sexo: " ",
            direccion: " ",
            discapacidad: [],
            tutor: true,
            fundacion: " ",
            userType: "R"
        };
        try {
            setData([...data, newUser]);

            axios.post('http://localhost:4000/addUser', newUser)
                .then((res) => {
                    edit(res.data.element._id);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }

    };
    return (
        <Form form={form} component={false}>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                Añadir Usuario
            </Button>
            <Table
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

export default ManageUsers;