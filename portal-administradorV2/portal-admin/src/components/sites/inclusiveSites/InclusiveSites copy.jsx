import React, { useState, useEffect } from 'react';
import axios from "axios";
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, Select, message, AutoComplete, DatePicker } from 'antd';

// Para el idioma español y otra cosa de la componente DataPicker
import esES from 'antd/es/date-picker/locale/es_ES';
import moment from 'moment';

// import dayjs from 'dayjs';
// import 'dayjs/locale/es';
// import esES from 'antd/es/locale/es_ES';
// dayjs.locale('es');

const { Option } = Select;
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
    <Option key="Comunicación" value=" Comunicacion ">Comunicación</Option>,
    <Option key="Mental" value=" Mental ">Mental</Option>,
    <Option key="Multiples" value=" Multiples ">Múltiples</Option>,
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

/*const selectedValues = [
    {
        title: "Sexo*",
        key: "gender",
        values: ""
    },
    {
        title: "Discapacidad",
        key: "condition",
        values: []
    },
    {
        title: "Rol*",
        key: "userType",
        values: ""
    },
    {
        title: "Tutor*",
        key: "isCaregiver",
        values: ""
    }
]*/

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
    const inputNode = dataIndex === "password" ? <Input.Password /> : <Input />;
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
                            /*onChange={(val) => {
                                const col = selectedValues.find(column => column.title === title);
                                if (title === "Discapacidad") {
                                    let newArray = [...val]
                                    if (col.values.includes([...val])) {
                                        newArray = newArray.filter(disa => disa !== [...val])
                                    }
                                    col["values"] = newArray;
                                } else if (title === "Sexo*" || title === "Rol*" || title === "Tutor*") {
                                    col["values"] = val;

                                }
                            }}*/
                            >
                                {options(title)}
                            </Select>
                        </Form.Item>
                    ) : ((title !== "Fecha de nacimiento*") ? (
                        <Form.Item
                            name={dataIndex}
                            style={{
                                margin: 0,
                            }}
                            rules={[
                                {
                                    required: (title === 'Fundación') ? false : true,
                                    message: `¡Introduzca un ${title} válido!`,
                                    pattern: rules(dataIndex),
                                },
                            ]}
                        >
                            {inputNode}
                        </Form.Item>
                    ) : (
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
                    ))}
                </>
            ) : (
                children
            )}
        </td>
    );
};


const ManageInclusiveSites = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        axios.get('http://localhost:4000/all_users')
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

    const edit = (record) => {
        record.dateOfBirth = moment(record.dateOfBirth); // Necesario para resolver el error de date.clone de moment
        form.setFieldsValue({
            ...record
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
            console.log(row);

            /*let mVals = {
                gender: "",
                condition: [],
                userType: "",
                isCaregiver: ""
            };
            selectedValues.forEach(column => {
                if (column.key === "gender") {
                    mVals["gender"] = column.values;
                } else if (column.key === "condition") {
                    column.values.forEach((arr) => mVals["condition"].push(arr));
                } else if (column.key === "userType") {
                    mVals["userType"] = column.values;
                } else if (column.key === "isCaregiver") {
                    mVals["isCaregiver"] = column.values;
                }
            });
            console.log(mVals);*/

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
                            /*selectedValues.forEach(column => {
                                if (column.key === "condition") {
                                    column.values = [];
                                } else {
                                    column.values = "";
                                }
                            })*/
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
            // console.log('Validate Failed:', errInfo); //Modificar esto, no puede ser por consola.
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
            sorter: (a, b) => a.gender.localeCompare(b.gender)
        },
        {
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
            fixed: "right",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Popconfirm title="¿Estás seguro?" cancelText="Seguir Editando" onConfirm={() => saveEdit(record._id)}>
                            <Typography.Link
                                keyboard
                                style={{
                                    marginRight: 8,
                                }}
                            >
                                Guardar
                            </Typography.Link>
                        </Popconfirm>
                        <Popconfirm title="¿Estás seguro?" cancelText="Seguir Editando" onConfirm={cancel}>
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


    const handleAdd = () => {
        const index = data.findIndex((item) => "0" === item._id);
        if (index === -1) {
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
                userType: ""
            };
            setData([...data, newUser]);
            edit(newUser);
        } else {
            message.error('Ya se encuentra creando un usuario. Finalice la creación o elimine el registro añadido');
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
                scroll={{ x: 2150 }}
            />
        </Form>
    );
};

export default ManageInclusiveSites;