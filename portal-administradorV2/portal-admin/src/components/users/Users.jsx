import React, { useState, useEffect } from 'react';
import axios from '../../api/axios'; // Ojo, se usa un archivo axios personalizado, para no tener que poner localhost:4000 a cada rato
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, Select, message, AutoComplete, DatePicker, Tag, Tooltip } from 'antd';
import esES from 'antd/es/date-picker/locale/es_ES';
import moment from 'moment';
import UploadComponent from './UploadComponent';
import validator from "validator";
import ExpandableText from './ExpandableText';

const { Option } = Select;
const { TextArea } = Input;
const gender = [
    <Option key="Masculino" value="Masculino">Masculino</Option>,
    <Option key="Femenino" value="Femenino">Femenino</Option>,
    <Option key="Otro" value="Otro">Otro</Option>
];

const disabilities = [
    <Option key="Motriz" value=" Motriz ">Motriz</Option>,
    <Option key="Visual" value=" Visual ">Visual</Option>,
    <Option key="Auditiva" value=" Auditiva ">Auditiva</Option>,
    <Option key="Sensorial" value=" Sensorial ">Sensorial</Option>,
    <Option key="Comunicación" value=" Comunicación ">Comunicación</Option>,
    <Option key="Mental" value=" Mental ">Mental</Option>,
    <Option key="Multiples" value=" Múltiples ">Múltiples</Option>,
    <Option key="Otra" value=" Otra ">Otra(s)</Option>
];
const rol = [
    <Option key="Regular" value="Regular">Regular</Option>,
    <Option key="Propietario" value="Propietario">Propietario</Option>,
    <Option key="Administrador" value="Administrador">Administrador</Option>,
]

const isCaregiver = [
    <Select.Option key="Si" value="Si">Si</Select.Option>,
    <Select.Option key="No" value="No">No</Select.Option>
]
const options = (title) => {
    if (title === "Sexo*") {
        return gender;
    } else if (title === "Discapacidad") {
        return disabilities;
    } else if (title === "Rol*") {
        return rol;
    } else if (title === "Tutor*") {
        return isCaregiver;
    }
}

const rules = (dataIndex) => {
    if (dataIndex === 'name') {
        return (/^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/);
    } else if (dataIndex === 'lastName') {
        return (/^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/);
    } else if (dataIndex === 'email') {
        return (/^.*$/);
    } else if (dataIndex === 'password') {
        return (/^.*$/) // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords . Además, la segunda parte del regex hace match con el hash generado por bcrypt: https://stackoverflow.com/a/64636008/19294516
    } else if (dataIndex === 'institution') {
        return (/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,255}$/);
    } else if (dataIndex === 'address') {
        return (/^[a-zA-Z0-9 #,.-]{5,255}$/);
    }
};


const ManageUsers = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");
    const [availableSites, setAvailableSites] = useState("");

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();


    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageUrl(reader.result);
                setLoading(false);
                resolve(reader.result);
            }
            reader.onerror = (error) => reject(error);
        });

    const handleChange = async (info) => {
        if (info.file.type === 'image/jpeg' || info.file.type === 'image/png' || info.file.type === 'image/jpg') {
            await getBase64(info.file);
        }
    };

    const EditableCell = ({
        editing,
        availableSites,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = dataIndex === "password" ? <Input.Password /> : (dataIndex === "describeYourself")? <TextArea rows={4} maxLength={2000} />: <Input />;
        return (
            <td {...restProps}>
                {editing ? (
                    <>
                        {(title === "Sexo*" || title === "Discapacidad" || title === "Rol*" || title === "Tutor*") ? (
                            <Form.Item
                                name={dataIndex}
                                style={{
                                    margin: 0,
                                }}>
                                <Select
                                    mode={(title === "Discapacidad") ? "multiple" : ""}
                                    allowClear={(title === "Discapacidad") ? true : false}
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Seleccione una opción"
                                >
                                    {options(title)}
                                </Select>
                            </Form.Item>
                        ) : ((title === "Fecha de nacimiento*") ? (
                            <Form.Item
                                name={dataIndex}
                                style={{
                                    margin: 0,
                                }}
                                rules={[
                                    {
                                        type: 'object',
                                        required: true,
                                        message: `¡Introduzca una fecha!`
                                    },
                                ]}

                            >
                                <DatePicker
                                    locale={esES}
                                    showToday={false}
                                    format="YYYY-MM-DD"
                                    disabledDate={(current) => {
                                        // La función "disabledDate" recibe una fecha y debe devolver "true" si la fecha debe estar deshabilitada o "false" si la fecha debe estar habilitada.
                                        // En este caso, solo permite fechas entre hace 200 años y hoy.
                                        return current && (current < moment().subtract(200, 'years').startOf('day') || current > moment().endOf('day'));
                                    }}
                                    defaultPickerValue={moment().subtract(30, 'years').startOf("day")}
                                />
                            </Form.Item>
                        ) : ((title === 'Foto de perfil*') ? (
                            <Form.Item
                                name={dataIndex}
                                style={{
                                    margin: 0,
                                }}>
                                <UploadComponent loading={loading} handleChange={handleChange} imageUrl={imageUrl} />
                            </Form.Item>
                        ) :  (
                            <Form.Item
                                name={dataIndex}
                                style={{
                                    margin: 0,
                                }}
                                rules={[
                                    {
                                        required: (title === 'Fundación' || title === 'Facebook' || title === 'Instagram' || title === 'Twitter') ? false : true,
                                        message: `¡Introduzca un ${title} válido!`,
                                        pattern: rules(dataIndex),
                                        validator: async (_, value) => {
                                            if (title === 'Email*') {
                                                const aux = validator.isEmail(value) ? Promise.resolve() : Promise.reject();
                                                return aux;
                                            } else if (title === 'Contraseña*') {
                                                const aux = validator.isStrongPassword(value) ? Promise.resolve() : Promise.reject();
                                                return aux;
                                            }else if(dataIndex === 'socialFacebook' || dataIndex === 'socialInstagram' || dataIndex === 'socialTwitter'){
                                                const aux = (value==='')? true : (validator.isURL(value, {protocols: ['https']}) && (value.startsWith('https://')) ? Promise.resolve() : Promise.reject()) ;
                                                return aux;
                                            }
                                            return true;
                                        }
                                    },
                                ]}
                            >
                                {inputNode}
                            </Form.Item>
                        )))}

                    </>
                ) : (
                    (inputType === 'object') ? <img src={record.profilePicture} alt='Foto de perfil' style={{ width: 'auto', height: '70px', borderRadius: '50%' }} /> : children
                )
                }
            </td >
        );
    };

    useEffect(() => {
        axios.get('/all_users', { headers: { 'token': localStorage.getItem("token") } })
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

        axios.get('/getInclusiveSites', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setAvailableSites(res.data);
            }).catch((error) => console.error(error));

    }, [])

    const isEditing = (record) => record._id === editingKey;

    const edit = (record) => {
        record.dateOfBirth = moment(record.dateOfBirth); // Necesario para resolver el error de date.clone de moment
        form.setFieldsValue({
            ...record
        });
        setEditingKey(record._id);
        setImageUrl(record.profilePicture)
    };

    const cancel = () => {
        setEditingKey('');
        setImageUrl('');
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
                    userType: row["userType"],
                    associatedSites: [],
                    profilePicture: imageUrl
                }

                axios.post('/addUser', newUser, { headers: { 'token': localStorage.getItem("token") } })
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
                            setImageUrl("");
                            message.success(res.data.message);
                        } else message.warning(res.status + " - Respuesta del servidor desconocida");
                    })
                    .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                        if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                        else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                        else message.warning(error.response.status + " - Respuesta del servidor desconocida");
                    });
            } else if (key !== "0" && row.name && row.lastName && row.email && row.password && row.dateOfBirth && row.gender && row.address && row["isCaregiver"] && row.userType) {

                axios.post('/editUser', { ...item, ...row, imageUrl }, { headers: { 'token': localStorage.getItem("token") } })
                    .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

                        if (res.status === 200) {
                            // Estas 3 lineas son para pasar la visualización de la fecha de nacimiento de 2022-10-10T00:00:00.000Z a 2022-10-10
                            let dateOfBirth = new Date(res.data.doc.dateOfBirth);
                            let dateOfBirth2 = dateOfBirth.getFullYear() + "-" + (dateOfBirth.getMonth() + 1) + "-" + dateOfBirth.getDate();
                            res.data.doc.dateOfBirth = dateOfBirth2;

                            newData.splice(index, 1, res.data.doc);
                            console.log("res: ", res);
                            setData(newData);
                            setEditingKey('');
                            setImageUrl("");
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
            // console.log('Validate Failed:', errInfo); //Modificar esto, no puede ser por consola.
        }
    };

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

    const columns = [
        {
            title: 'Foto de perfil*',
            dataIndex: "profilePicture",
            key: "profilePicture",
            width: "4%",
            align: "left",
            editable: true,
        },
        {
            title: 'Nombre*',
            dataIndex: "name",
            width: "6%",
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
            title: 'Apellido*',
            dataIndex: "lastName",
            width: "5%",
            key: "lastName",
            editable: true,
            sorter: (a, b) => a.lastName.localeCompare(b.lastName)
        },
        {
            title: 'Email*',
            dataIndex: "email",
            key: "email",
            editable: true,
            sorter: (a, b) => a.email.localeCompare(b.email)
        },
        {
            title: 'Descripción*',
            dataIndex: "describeYourself",
            key: "describeYourself",
            editable: true,
            render: (text) => <ExpandableText text={text} maxLength={256} />,
        },
        {
            title: 'Contraseña*',
            dataIndex: "password",
            width: "4%",
            ellipsis: true,
            key: "password",
            editable: true,
        },
        {
            title: 'Fecha de nacimiento*',
            dataIndex: "dateOfBirth",
            width: "5%",
            key: "dateOfBirth",
            editable: true
        },
        {
            title: 'Sexo*',
            dataIndex: "gender",
            width: "4%",
            key: "gender",
            editable: true,
            sorter: (a, b) => a.gender.localeCompare(b.gender)
        },
        {
            title: 'Dirección*',
            dataIndex: "address",
            key: "address",
            editable: true,
            sorter: (a, b) => a.address.localeCompare(b.address)
        },
        {
            title: 'Discapacidad',
            dataIndex: "condition",
            width: "5%",
            key: "condition",
            editable: true,
            render: (elements) => {
                const aux = elements.map((element) => {
                    return (<Tag>{element}</Tag>);
                })
                return aux;
            },
            sorter: (a, b) => a.condition.length - b.condition.length
        },
        {
            title: 'Tutor*',
            dataIndex: "isCaregiver",
            width: "3%",
            key: "isCaregiver",
            editable: true,
            sorter: (a, b) => a.isCaregiver.localeCompare(b.isCaregiver)
        },
        {
            title: 'Fundación',
            dataIndex: "institution",
            width: "6%",
            key: "institution",
            editable: true,
            sorter: (a, b) => a.institution.localeCompare(b.institution)
        },
        {
            title: 'Rol*',
            dataIndex: "userType",
            width: "5%",
            key: "userType",
            editable: true,
            sorter: (a, b) => a.userType.localeCompare(b.userType)
        },
        {
            title: 'Sitios asociados',
            dataIndex: "associatedSites",
            width: "4%",
            key: "associatedSites",
            editable: false,
            render: (e) => {
                let sites = '';
                if (e) {
                    sites = e.map((item) => (
                        <Tooltip title={item.name} key={item.id}>
                            <Tag key={item.id} color={"blue"} style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.name}
                            </Tag>
                        </Tooltip>
                    ));
                }

                return <div style={{ whiteSpace: 'pre-wrap' }}>{sites}</div>;
            }
        },
        {
            title: 'Facebook',
            dataIndex: "socialFacebook",
            key: "socialFacebook",
            editable: true
        },
        {
            title: 'Instagram',
            dataIndex: "socialInstagram",
            key: "socialInstagram",
            editable: true
        },
        {
            title: 'Twitter',
            dataIndex: "socialTwitter",
            key: "socialTwitter",
            editable: true
        },
        {
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
            width: "5%",
            fixed: "right",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Popconfirm title="¿Estás seguro?" cancelText="Seguir Editando" onConfirm={() => saveEdit(record._id)}>
                            <Typography.Link
                                keyboard
                            >
                                Guardar
                            </Typography.Link>
                        </Popconfirm>
                        <Popconfirm title="¿Estás seguro?" cancelText="Seguir Editando" onConfirm={cancel}>
                            <Typography.Link keyboard type="danger" style={{ marginRight: 8 }}>
                                Cancelar
                            </Typography.Link>
                        </Popconfirm>
                        </Space>
                ) : (
                    <Space>
                        <Typography.Link keyboard disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>
                        <Popconfirm title="¿Estás seguro?" cancelText="Cancelar" onConfirm={() => handleDelete(record._id)}>
                            <Typography.Link keyboard style={{ marginRight: 8 }} disabled={editingKey !== ''} type="danger">
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
                inputType: (col.key === 'profilePicture') ? 'object' : col.dataIndex,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    const handleAdd = () => {
        const index = data.findIndex((item) => "0" === item._id);
        if (index === -1 && editingKey === "") {
            const newUser = {
                _id: "0",
                name: "",
                lastName: "",
                email: "",
                password: "",
                dateOfBirth: new Date(),
                gender: "",
                address: "",
                condition: [],
                isCaregiver: "",
                institution: "",
                userType: "",
                associatedSites: [],
                profilePicture: ""
            };
            setData([...data, newUser]);
            edit(newUser);
        } else {
            message.error('Ya se encuentra creando o editando un usuario. Finalice la creación o elimine el registro añadido');
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
                    pageSize: 10
                }}
                scroll={{ x: 3500 }}
            />
        </Form>
    );
};

export default ManageUsers;