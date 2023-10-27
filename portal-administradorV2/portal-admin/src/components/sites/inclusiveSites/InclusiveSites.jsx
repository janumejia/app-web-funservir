import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios'; // Ojo, se usa un archivo axios personalizado, para no tener que poner localhost:4000 a cada rato
import "antd/dist/antd.min.css";
import './index.css';
import GalleryVisualizationMode from './GalleryVisualizationMode';
import AddEditInclusiveSite from './AddEditForm';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, message, AutoComplete, Tag } from 'antd';
import ExpandableText from './ExpandableText'; // La componente de abreviar texto
import {
    IoLogoWhatsapp,
    IoLogoTwitter,
    IoLogoFacebook,
    IoLogoInstagram,
} from 'react-icons/io';
import { FaXTwitter } from 'react-icons/fa6';

const { Link } = Typography;

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
const ManageInclusiveSites = ({ isAnySitePending, setIsAnySitePending }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {

        axios.get('/getInclusiveSites', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setData(res.data); // Se ajustan los datos recibidos del backend
            }).catch((error) => console.error(error));
        if (isAnySitePending === true) setSearchedText('Pendiente');
    }, [])

    //let isEditing = (record) => record._id === editingKey;

    const edit = (record) => {
        // record.owner._id = data.owner._id
        editedObject = { ...record };
        setEditingKey(record._id);
    };

    const cancel = async () => {

        await axios.get('/getInclusiveSites', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setData(res.data); // Se ajustan los datos recibidos del backend
            }).catch((error) => console.error(error));

        setEditingKey('');
    };

    const handleDelete = (key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item._id);
        if (key !== "0") {
            axios.post('/deleteInclusiveSites', { _id: key }, { headers: { 'token': localStorage.getItem("token") } })
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
                    || String(record.description).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.category).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.contactNumber).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.inclusiveElements).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.locality).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.neighborhood).toLocaleLowerCase().includes(value.toLocaleLowerCase())
                    || String(record.status).toLocaleLowerCase().includes(value.toLocaleLowerCase())
            }
        },
        {
            title: 'Descripción*',
            dataIndex: "description",
            key: "description",
            editable: true,
            sorter: (a, b) => a.description.localeCompare(b.description),
            render: (text) => <ExpandableText text={text} maxLength={256} />,
        },
        {
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
            editable: true,
            sorter: (a, b) => a.contactNumber.localeCompare(b.contactNumber)
        },
        {
            title: 'Segundo número de contacto',
            dataIndex: "contactNumber2",
            key: "contactNumber2",
            editable: true,
            sorter: (a, b) => a.contactNumber2.localeCompare(b.contactNumber2)
        },
        {
            title: 'Elementos inclusivos*',
            dataIndex: "inclusiveElements",
            key: "inclusiveElements",
            editable: true,
            render: (elements) => {
                const aux = elements.map((element) => {
                    return (<Tag key={element._id} color={"blue"}>{element.name}</Tag>);
                })
                return aux;
            }
        },
        {
            title: 'Más información sobre inclusividad del sitio',
            dataIndex: "moreInfoInclusivity",
            key: "moreInfoInclusivity",
            editable: true,
            sorter: (a, b) => {
                if (!a || !a.moreInfoInclusivity) a.moreInfoInclusivity = ""
                if (!b || !b.moreInfoInclusivity) b.moreInfoInclusivity = ""

                return a.moreInfoInclusivity.localeCompare(b.moreInfoInclusivity);
            }
        },
        {
            title: 'Horario*',
            dataIndex: "schedule",
            key: "schedule",
            editable: true,
            render: (schedule) => {
                if (schedule) {
                    const aux = Object.entries(schedule).map(([day, times]) => {
                        if (times.start && times.end) return (<Tag key={day} color={"green"}> {day.slice(0, 2)} {times.start}-{times.end}</Tag>);
                        else return (<Tag key={day}> {day.slice(0, 2)} Cerrado</Tag>);
                    })
                    return aux

                } else {
                    return "-"
                }
            }
        },
        {
            title: 'Dirección*',
            dataIndex: "siteAddress",
            key: "siteAddress",
            editable: true,

        },
        {
            title: 'Redes sociales y página web',
            dataIndex: "socialNetworksAndWebpage",
            key: "socialNetworksAndWebpage",
            editable: true,
            render: (_, record) => {
                let dataInRecord = record

                console.log("dataInRecord: ", dataInRecord);
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* First row of social network icons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {record?.socialWhatsapp && (
                                <a
                                    key="whatsapp"
                                    href={"https://api.whatsapp.com/send?phone=57" + record.socialWhatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="WhatsApp"
                                >
                                    <IoLogoWhatsapp style={{ fill: "#21b639", fontSize: "22px" }} />
                                </a>
                            )}
                            {record?.socialTwitter && (
                                <a
                                    key="twitter"
                                    href={record.socialTwitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="X (Twitter)"
                                >
                                    <FaXTwitter style={{ fill: "#0f1419", fontSize: "22px" }} />
                                </a>
                            )}
                        </div>

                        {/* Second row of social network icons */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {record?.socialFacebook && (
                                <a
                                    key="facebook"
                                    href={record.socialFacebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Facebook"
                                >
                                    <IoLogoFacebook style={{ fill: "#3b5998", fontSize: "22px" }} />
                                </a>
                            )}
                            {record?.socialInstagram && (
                                <a
                                    key="instagram"
                                    href={record.socialInstagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Instagram"
                                >
                                    <IoLogoInstagram style={{ fill: "#e4405f", fontSize: "22px" }} />
                                </a>
                            )}
                        </div>

                        {/* Web page button */}
                        {record?.webpage && (
                            <div style={{ marginTop: '10px' }}>
                                <a
                                    key="webpage"
                                    href={record.webpage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Página web"
                                >
                                    <Button>Página web</Button>
                                </a>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Localidad*',
            dataIndex: "locality",
            key: "locality",
            editable: true,
            sorter: (a, b) => a.locality.localeCompare(b.locality)
        },
        {
            title: 'Barrio*',
            dataIndex: "neighborhood",
            key: "neighborhood",
            editable: true,
            sorter: (a, b) => a.locality.localeCompare(b.locality)
        },
        {
            title: 'Ubicación',
            dataIndex: "location",
            key: "location",
            editable: true,
            render: (item) => {
                return (
                    <Link href={`http://www.google.com/maps/place/${Object.values(item)[0]},${Object.values(item)[1]}`} target="_blank">
                        {"Lat: " + Object.values(item)[0] + ", Lng: " + Object.values(item)[1]}
                    </Link>
                )
            }
        },
        {
            title: 'Galeria*',
            dataIndex: 'gallery',
            key: "gallery",
            editable: true,
            render: (gallery) => {
                const imgs = gallery.map((element) => {
                    // const urlSplitted = element.public_id.split("/");
                    const objToReturn = {
                        uid: element.asset_id,
                        key: element.asset_id,
                        name: element.asset_id,
                        url: element.secure_url,
                    }
                    return objToReturn;
                })

                return <GalleryVisualizationMode urlArray={imgs} />
            }
        },
        {
            title: 'Dueño*',
            dataIndex: "owner",
            key: "owner",
            editable: true,
            render: (e) => {
                if (e) {
                    return e.name + " " + e.lastName;
                }
            },
            sorter: (a, b) => a.locality.localeCompare(b.locality)
        },
        {
            title: 'Estado',
            dataIndex: "status",
            key: "status",
            editable: true,
            render: (status) => {
                let color = "";

                if (status) {
                    if (status === "Aprobado") {
                        color = "green";
                    } else if (status === "Pendiente") {
                        color = "yellow";
                    } else if (status === "Rechazado") {
                        color = "red";
                    }
                }

                return (
                    <Tag key={color} color={color}>
                        {status}
                    </Tag>
                )
            },
            sorter: (a, b) => {
                if (!a || !a.status) a.status = ""
                if (!b || !b.status) b.status = ""

                return a.status.localeCompare(b.status);
            }
        },
        {
            title: 'Última actualización',
            dataIndex: "updatedAt",
            key: "updatedAt",
            editable: false,
            render: (text, record) => {
                const date = new Date(text);
                return date.toLocaleDateString();
            },
            sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt)
        },
        {
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
            width: "8%",
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
                contactNumber2: "",
                inclusiveElements: [],
                moreInfoInclusivity: "",
                socialWhatsapp: "",
                socialInstagram: "",
                socialFacebook: "",
                socialTwitter: "",
                webpage: "",
                siteAddress: "",
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

    return (
        editingKey ?
            (
                <>
                    <AddEditInclusiveSite site={editedObject} />
                    <Popconfirm title="¿Estás seguro?" okText="Regresar" cancelText="Seguir editando" onConfirm={cancel}>
                        <Button type="primary" danger style={{ "marginLeft": "19px" }}>
                            Regresar
                        </Button>
                    </Popconfirm>
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
                                    setIsAnySitePending(value);
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
            )
    )
};

export default ManageInclusiveSites;