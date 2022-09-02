import React, { useState, useEffect } from 'react';
import axios from "axios";
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button } from 'antd';

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
    }, [])

    const isEditing = (record) => record._id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
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
            console.log(key,'test');
            if (index > -1 && !(key===undefined)) {
                
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
                            onClick={() => saveEdit(record._id)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a href=" ">Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
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
                    setEditingKey('');
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
        
    };
    return (
        <>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                Añadir Usuario
            </Button>
            <Form form={form} component={false}>
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
        </>);
};

export default ManageUsers;