import React, { useState, useEffect } from 'react';
import axios from "axios";
import "antd/dist/antd.min.css";
import './index.css';
import AddEditInclusiveSite from './AddEditForm';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, Select, message, AutoComplete, DatePicker } from 'antd';

// Para el idioma español y otra cosa de la componente DataPicker
import esES from 'antd/es/date-picker/locale/es_ES';
import moment from 'moment';



const rules = (dataIndex) => {
    if (dataIndex === 'name') {
        return (/^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/);
    } else if (dataIndex === 'lastName') {
        return (/^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/);
    } else if (dataIndex === 'email') {
        return (/^\w+([.-]?\w+){1,150}@\w+([.-]?\w+){1,147}(\.\w{2,3})+$/);
    } else if (dataIndex === 'password') {
        return (/^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/) // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords . Además, la segunda parte del regex hace match con el hash generado por bcrypt: https://stackoverflow.com/a/64636008/19294516
    } else if (dataIndex === 'institution') {
        return (/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){0,100}$/);
    }
};


const ManageInclusiveSites = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        axios.get('http://localhost:4000/getInclusiveSites')
            .then((res) => {
                // Para modificar el formato de la fecha, ya que llega de esta forma: 2022-10-10T00:00:00.000Z
                // y se debe convertir a un formato más fácil de leer: 2022-10-10
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].dateOfBirth) {
                        let dateOfBirthAux = moment(res.data[i].dateOfBirth).format("YYYY-MM-DD");
                        res.data[i].dateOfBirth = dateOfBirthAux;
                    }
                }

                setData(res.data); // Se ajustan los datos recibidos del backend
            }).catch((error) => console.error(error));
    }, [])

    const isEditing = (record) => record._id === editingKey;
    let editedObject = {};
    const edit = (record) => {
        //Poner la redirección a la página de edición
        setEditingKey(record._id);
        editedObject = {...record}
        console.log(editedObject);
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

            if (key === "0" && row.name && row.lastName && row.email && row.password && row.dateOfBirth && row.gender && row.address && row.isCaregiver && row.userType) {

                const newUser = {
                    name: row.name,
                    lastName: row.lastName,
                    email: row.email,
                    password: row.password,
                    dateOfBirth: row.dateOfBirth,
                    gender: row["gender"],
                    address: row.address,
                    condition: [...row.condition],
                    isCaregiver: row["isCaregiver"],
                    institution: row.institution,
                    userType: row["userType"]
                }

                axios.post('http://localhost:4000/addUser', newUser)
                    .then((res) => {

                        // Respuesta OK
                        if (res.status === 200) {
                            // Estas 3 lineas son para pasar la visualización de la fecha de nacimiento de 2022-10-10T00:00:00.000Z a 2022-10-10
                            let dateOfBirth = new Date(res.data.element.dateOfBirth);
                            let dateOfBirth2 = dateOfBirth.getFullYear() + "-" + (dateOfBirth.getMonth() + 1) + "-" + dateOfBirth.getDate();
                            res.data.element.dateOfBirth = dateOfBirth2;

                            newData.splice(index, 1, res.data.element);
                            setData(newData);
                            setEditingKey('');
                            message.success(res.data.message);
                        } else message.warning(res.status + " - Respuesta del servidor desconocida");
                    })
                    .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                        if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                        else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                        else message.warning(error.response.status + " - Respuesta del servidor desconocida");
                    });
            } else if (key !== "0" && row.name && row.lastName && row.email && row.password && row.dateOfBirth && row.gender && row.address && row["isCaregiver"] && row.userType) {

                axios.post('http://localhost:4000/editUser', { ...item, ...row })
                    .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

                        if (res.status === 200) {
                            // Estas 3 lineas son para pasar la visualización de la fecha de nacimiento de 2022-10-10T00:00:00.000Z a 2022-10-10
                            let dateOfBirth = new Date(res.data.doc.dateOfBirth);
                            let dateOfBirth2 = dateOfBirth.getFullYear() + "-" + (dateOfBirth.getMonth() + 1) + "-" + dateOfBirth.getDate();
                            res.data.doc.dateOfBirth = dateOfBirth2;

                            console.log("res.data: ", res.data)
                            newData.splice(index, 1, res.data.doc);
                            setData(newData);
                            setEditingKey('');

                            message.success(res.data.message);
                        } else message.warning(res.status + " - Respuesta del servidor desconocida");
                    })
                    .catch((error) => {// Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                        if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                        else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                        else message.warning(error.response.status + " - Respuesta del servidor desconocida");
                    });
            } else {
                message.warning('¡Debes completar todos los campos obligatorios!');
            }
        } catch (errInfo) {
            message.warning('¡Debes completar todos los campos en un formato válido!');
        }
    };

    const handleDelete = (key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item._id);
        if (key !== "0") {
            axios.post('http://localhost:4000/deleteUser', { _id: key })
                .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

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
        } else {
            newData.splice(index, 1);
            setData(newData);
            message.success('Se ha eliminado el Usuario exitosamente');
        }
    };

    const columns = [
        {
            title: 'Nombre*',
            dataIndex: "name",
            key: "name",
            editable: true,
            sorter: (a, b) => a.name.localeCompare(b.name),
            filteredValue: [searchedText],
            onFilter: (value, record) => {
                return String(record.name).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.lastName).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.email).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.address).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.institution).toLocaleLowerCase().includes(value.toLocaleLowerCase())
            }
        },
        {
            title: 'Descripción*',
            dataIndex: "description",
            key: "description",
            title: 'Descripción*',
            dataIndex: "description",
            key: "description",
            editable: true,
            sorter: (a, b) => a.description.localeCompare(b.description)
        },
        {
            title: 'Categoría*',
            dataIndex: "category",
            key: "category",
            title: 'Categoria*',
            dataIndex: "category",
            key: "category",
            editable: true,
            sorter: (a, b) => a.category.localeCompare(b.category)
        },
        {
            title: 'Número de contacto*',
            dataIndex: "contactNumber",
            key: "contactNumber",
            title: 'Número de contacto*',
            dataIndex: "contactNumber",
            ellipsis: true,
            key: "contactNumber",
            editable: true,
            sorter: (a, b) => a.contactNumber.localeCompare(b.contactNumber)
        },
        {
            title: 'Elementos inclusivos',
            dataIndex: "inclusiveElements",
            key: "inclusiveElements",
            editable: true,
            sorter: (a, b) => a.inclusiveElements.length - b.inclusiveElements.length
        },
        {
            title: 'Ubicación*',
            dataIndex: "location",
            key: "location",
            title: 'Elementos inclusivos*',
            dataIndex: "inclusiveElements",
            key: "inclusiveElements",
            editable: true,
            sorter: (a, b) => a.location.localeCompare(b.location)
        },
        {
            title: 'Localidad*',
            dataIndex: "locality",
            key: "locality",
            title: 'Ubicación',
            dataIndex: "location",
            key: "location",
            editable: true,
            sorter: (a, b) => a.locality.localeCompare(b.locality)
        },
        {
            title: 'Barrio*',
            dataIndex: "neighborhood",
            key: "neighborhood",
            editable: true,
            sorter: (a, b) => a.neighborhood.localeCompare(b.neighborhood)
            title: 'Localidad*',
            dataIndex: "locality",
            key: "locality",
            editable: true
        },
        {
            title: 'Galería*',
            dataIndex: "gallery",
            key: "gallery",
            title: 'Barrio*',
            dataIndex: "neighborhood",
            key: "neighborhood",
            editable: true,
            sorter: (a, b) => a.gallery.localeCompare(b.gallery)
            sorter: (a, b) => a.gender.localeCompare(b.gender)
        },
        {
            title: 'Galeria*',
            dataIndex: "gallery",
            key: "gallery",
            editable: true,
            sorter: (a, b) => a.gender.localeCompare(b.gender)
        },
        {
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
            fixed: "right",
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Typography.Link keyboard disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>
                        <Popconfirm title="¿Estás seguro?" cancelText="Cancelar" onConfirm={() => handleDelete(record._id)}>
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
        return col;
    });


    const handleAdd = () => {
        //Llevar a la nueva página de añadir
    };

    return editingKey ?
        (
            <>
            <AddEditInclusiveSite />
                <Space>
                    <Button type="primary" onClick={cancel}>
                        Regresar
                    </Button>
                </Space>
            </>
        ) : (
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
                        Añadir Usuario
                    </Button>
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
                    scroll={{ x: 2150 }}
                />
            </Form>
        );
};

export default ManageInclusiveSites;