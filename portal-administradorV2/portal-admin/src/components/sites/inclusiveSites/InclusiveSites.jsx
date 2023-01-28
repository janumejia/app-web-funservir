import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios'; // Ojo, se usa un archivo axios personalizado, para no tener que poner localhost:4000 a cada rato
import "antd/dist/antd.min.css";
import './index.css';
import GalleryVisualizationMode from './GalleryVisualizationMode';
import AddEditInclusiveSite from './AddEditForm';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, message, AutoComplete } from 'antd';

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

let editedObject = {};
const ManageInclusiveSites = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        axios.get('/getInclusiveSites', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setData(res.data); // Se ajustan los datos recibidos del backend
            }).catch((error) => console.error(error));
    }, [])
    let isEditing = (record) => record._id === editingKey;

    const edit = (record) => {
        editedObject = { ...record };
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    // const saveEdit = async (key) => {
    //     try {

    //         const row = await form.validateFields();
    //         const newData = [...data];
    //         const index = newData.findIndex((item) => key === item._id);
    //         const item = newData[index];

    //         if (key === "0" && row.name && row.lastName && row.email && row.password && row.dateOfBirth && row.gender && row.address && row.isCaregiver && row.userType) {

    //             const newUser = {
    //                 name: row.name,
    //                 lastName: row.lastName,
    //                 email: row.email,
    //                 password: row.password,
    //                 dateOfBirth: row.dateOfBirth,
    //                 gender: row["gender"],
    //                 address: row.address,
    //                 condition: [...row.condition],
    //                 isCaregiver: row["isCaregiver"],
    //                 institution: row.institution,
    //                 userType: row["userType"]
    //             }

    //             axios.post('/addUser', newUser, { headers: { 'token': localStorage.getItem("token") } })
    //                 .then((res) => {

    //                     // Respuesta OK
    //                     if (res.status === 200) {
    //                         // Estas 3 lineas son para pasar la visualización de la fecha de nacimiento de 2022-10-10T00:00:00.000Z a 2022-10-10
    //                         let dateOfBirth = new Date(res.data.element.dateOfBirth);
    //                         let dateOfBirth2 = dateOfBirth.getFullYear() + "-" + (dateOfBirth.getMonth() + 1) + "-" + dateOfBirth.getDate();
    //                         res.data.element.dateOfBirth = dateOfBirth2;

    //                         newData.splice(index, 1, res.data.element);
    //                         setData(newData);
    //                         setEditingKey('');
    //                         message.success(res.data.message);
    //                     } else message.warning(res.status + " - Respuesta del servidor desconocida");
    //                 })
    //                 .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
    //                     if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
    //                     else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
    //                     else message.warning(error.response.status + " - Respuesta del servidor desconocida");
    //                 });
    //         } else if (key !== "0" && row.name && row.lastName && row.email && row.password && row.dateOfBirth && row.gender && row.address && row["isCaregiver"] && row.userType) {

    //             axios.post('/editUser', { ...item, ...row }, { headers: { 'token': localStorage.getItem("token") } })
    //                 .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

    //                     if (res.status === 200) {
    //                         // Estas 3 lineas son para pasar la visualización de la fecha de nacimiento de 2022-10-10T00:00:00.000Z a 2022-10-10
    //                         let dateOfBirth = new Date(res.data.doc.dateOfBirth);
    //                         let dateOfBirth2 = dateOfBirth.getFullYear() + "-" + (dateOfBirth.getMonth() + 1) + "-" + dateOfBirth.getDate();
    //                         res.data.doc.dateOfBirth = dateOfBirth2;

    //                         newData.splice(index, 1, res.data.doc);
    //                         setData(newData);
    //                         setEditingKey('');

    //                         message.success(res.data.message);
    //                     } else message.warning(res.status + " - Respuesta del servidor desconocida");
    //                 })
    //                 .catch((error) => {// Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
    //                     if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
    //                     else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
    //                     else message.warning(error.response.status + " - Respuesta del servidor desconocida");
    //                 });
    //         } else {
    //             message.warning('¡Debes completar todos los campos obligatorios!');
    //         }
    //     } catch (errInfo) {
    //         message.warning('¡Debes completar todos los campos en un formato válido!');
    //     }
    // };

    const handleDelete = (key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item._id);
        if (key !== "0") {
            axios.post('/deleteUser', { _id: key }, { headers: { 'token': localStorage.getItem("token") } })
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
    const [contador, setContador] = useState(0);
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
            editable: true,
            sorter: (a, b) => a.lastName.localeCompare(b.lastName)
        },
        {
            title: 'Categoria*',
            dataIndex: "category",
            key: "category",
            editable: true,
            sorter: (a, b) => a.email.localeCompare(b.email)
        },
        {
            title: 'Número de contacto*',
            dataIndex: "contactNumber",
            ellipsis: true,
            key: "contactNumber",
            editable: true,
        },
        {
            title: 'Elementos inclusivos*',
            dataIndex: "inclusiveElements",
            key: "inclusiveElements",
            editable: true,
            sorter: (a, b) => a.address.localeCompare(b.address)
        },
        {
            title: 'Ubicación',
            dataIndex: "location",
            key: "location",
            editable: true,
            render: (item) => { return Object.values(item)[0] + "," + Object.values(item)[1] },
            sorter: (a, b) => a.condition.length - b.condition.length
        },
        {
            title: 'Localidad*',
            dataIndex: "locality",
            key: "locality",
            editable: true
        },
        {
            title: 'Barrio*',
            dataIndex: "neighborhood",
            key: "neighborhood",
            editable: true,
            sorter: (a, b) => a.gender.localeCompare(b.gender)
        },
        {
            title: 'Galeria*',
            dataIndex: "gallery",
            key: "gallery",
            editable: true,
            render: (_, record) => {
                // const imgs = data.map((doc,index)=>doc.gallery.map((obj, j) => {
                //     return {
                //         uid: index * 4 + j + 1,
                //         key: index * 4 + j + 1,
                //         name: `img${index * 4 + j + 1}`,
                //         url: obj.secure_url
                //     }
                // }))
                const imgs = data.map((doc,index)=>doc.gallery.map((obj, j)=>{
                    return{
                        uid: index * 4 + j + 1,
                        key: index * 4 + j + 1,
                        name: `img${index * 4 + j + 1}`,
                        url: obj.secure_url
                    }
                }))
                
                return <GalleryVisualizationMode urlArray={imgs} myKey={record._id}/>
            },
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
        const index = data.findIndex((item) => "0" === item._id);
        if (index === -1) {
            const newUser = {
                _id: "0",
                name: "",
                description: "",
                category: "",
                contactNumber: "",
                inclusiveElements: [],
                location: { "lat": "", "lng": "" },
                locality: "",
                neighborhood: "",
                gallery: [],
            };
            edit(newUser);
        } else {
            message.error('Ya se encuentra creando un usuario. Finalice la creación o elimine el registro añadido');
        }
    };

    return editingKey ?
        (
            <>
                <AddEditInclusiveSite site={editedObject} />
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
                        Añadir sitio inclusivo
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