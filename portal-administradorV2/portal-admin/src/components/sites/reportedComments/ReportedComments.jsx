import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios'; // Ojo, se usa un archivo axios personalizado, para no tener que poner localhost:4000 a cada rato
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, Select, message, AutoComplete, Tooltip, Tag } from 'antd';


const { Option } = Select;
const ManageUsers = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    // const [locations, setLocations] = useState([]); // Para las localidades
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");

    // Traemos todos los barrios
    useEffect(() => {
        axios.get('/getReportedComments', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setData(res.data);
            }).catch((error) => console.error(error));
    }, [])

    const isEditing = (record) => record._id === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const saveEdit = async (key) => {
        try {

            console.log("key: ", key)
            const newData = [...data];
            const index = newData.findIndex((item) => key === item._id);

            axios.post('/keepReportedComment', { _id: key }, { headers: { 'token': localStorage.getItem("token") } })
                .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

                    // Respuesta OK
                    if (res.status === 200) {
                        newData.splice(index, 1);
                        setData(newData);
                        message.success(res.data.message);
                    } else message.warning(res.status + " - Respuesta del servidor desconocida");
                })
                .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                    if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                    else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                    else message.warning(error.response.status + " - Respuesta del servidor desconocida");
                });

        } catch (errInfo) {
            message.warning('¡Debes completar todos los campos obligatorios!');
            console.log('Validate Failed:', errInfo); //Modificar esto, no puede ser por consola.
        }
    };

    const handleDelete = (key) => {
        console.log("key: ", key)
        const newData = [...data];
        const index = newData.findIndex((item) => key === item._id);

        axios.post('/deleteReportedComments', { _id: key }, { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

                // Respuesta OK
                if (res.status === 200) {
                    newData.splice(index, 1);
                    setData(newData);
                    message.success(res.data.message);
                } else message.warning(res.status + " - Respuesta del servidor desconocida");
            })
            .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                else message.warning(error.response.status + " - Respuesta del servidor desconocida");
            });

    };

    const columns = [
        {
            title: 'Sitio',
            dataIndex: "siteId",
            key: "site",
            editable: false,
            render: (e) => {
                return e.name;
            }
        },
        {
            title: 'Autor',
            dataIndex: "userId",
            key: "autor",
            editable: false,
            render: (e) => {
                return e.name + " " + e.lastName + " - " + e.email;
            }
        },
        {
            title: 'Titulo',
            dataIndex: "title",
            key: "title",
    
            editable: false,
            sorter: (a, b) => a.title.localeCompare(b.title),
            filteredValue: [searchedText],
            onFilter: (value, record) => {
                return String(record.title).toLocaleLowerCase().includes(value.toLocaleLowerCase())
            }
        },
        {
            title: 'Contenido',
            dataIndex: "content",
            key: "content",
            editable: false,
            sorter: (a, b) => a.content.length - b.content.length
        },
        {
            title: 'Cantidad de reportes',
            dataIndex: "reportedBy",
            key: "reportedAmount",
            editable: false,
            render: (e) => {
                return e.length
            },
            sorter: (a, b) => a.reportedAmount < b.reportedAmount
        },
        {
            title: 'Reportado por',
            dataIndex: "reportedBy",
            key: "reportedBy",
            editable: false,
            render: (e) => {
                let users = '';
                if (e) {
                    users = e.map((item) => (
                        <Tooltip title={item.name + " " + item.lastName + " - " + item.email} key={item._id}>
                            <Tag key={item._id} color={"blue"} style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.email}
                            </Tag>
                        </Tooltip>
                    ));
                }

                return <div style={{ whiteSpace: 'pre-wrap' }}>{users}</div>;
            }
        },
        {
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
            // fixed: "right",
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Popconfirm title="Conservar comentario y quitar reportes. ¿Estas seguro?" cancelText="Cancelar" onConfirm={() => saveEdit(record._id)}>
                            <Typography.Link keyboard disabled={editingKey !== ''} >
                                Conservar
                            </Typography.Link>
                        </Popconfirm>
                        <Popconfirm title="Eliminar comentario. ¿Estás seguro?" cancelText="Cancelar" onConfirm={() => handleDelete(record._id)}>
                            <Typography.Link keyboard disabled={editingKey !== ''} type="danger">
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
                inputType: col.dataIndex,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Space align="start" wrap={true}>
                <div>
                    Comentarios reportados por otros usuarios
                </div>
                <AutoComplete
                    dropdownMatchSelectWidth={252}
                    style={{
                        width: 300
                    }}
                >
                    <Input.Search size='large'
                        placeholder="Buscar..."
                        enterButton
                        onSearch={(value) => {
                            setSearchedText(value);
                        }}
                    />
                </AutoComplete>

            </Space>
            <Table
                locale={{
                    triggerDesc: 'Ordenar descendiente',
                    triggerAsc: 'Ordenar ascendiente',
                    cancelSort: 'Cancelar ordenamiento'
                }}
                rowKey={record => record._id}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                    pageSize: 10
                }}
                scroll={{ x: 100 }}
            />
        </Form>
    );
};

export default ManageUsers;