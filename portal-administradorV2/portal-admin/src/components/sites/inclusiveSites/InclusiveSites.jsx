import React, { useState, useEffect } from 'react';
import axios from "axios";
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, Select, message, AutoComplete } from 'antd';


const { Option } = Select;
const gender = [
    <Option key="Masculino" value="M">M</Option>,
    <Option key="Femenino" value="F">F</Option>,
    <Option key="Otro" value="O">O</Option>
];

const disabilities = [
    <Option key="Motriz" value=" Motriz ">Motriz</Option>,
    <Option key="Visual" value=" Visual ">Visual</Option>,
    <Option key="Auditiva" value=" Auditiva ">Auditiva</Option>,
    <Option key="Sensorial" value=" Sensorial ">Sensorial</Option>,
    <Option key="Comunicación" value=" Comunicación ">Comunicación</Option>,
    <Option key="Mental" value=" Mental ">Mental</Option>,
    <Option key="Multiples" value=" Multiples ">Múltiples</Option>,
    <Option key="Otra" value=" Otra ">Otra(s)</Option>
];

console.log("disabilities:");
console.log(disabilities);

const rol = [
    <Option key="Regular" value="R">R</Option>,
    <Option key="Propietario" value="P">P</Option>,
    <Option key="Administrador" value="A">A</Option>,
]

const isCaregiver = [
    <Select.Option key="Sí" value="Sí">Sí</Select.Option>,
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

const selectedValues = [
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
]

const rules = (dataIndex) => {
    if (dataIndex === 'name') {
        return (/^[a-zA-Z0-9]+$/);
    } else if (dataIndex === 'email') {
        return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    } else if (dataIndex === 'age') {
        return (/^(?:\d*)$/)
    } else if (dataIndex === 'password') {
        return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)
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
                        <Select
                            mode={(title === "Discapacidad") ? "multiple" : ""}
                            allowClear={(title === "Discapacidad") ? true : false}
                            style={{
                                width: '100%',
                            }}
                            placeholder="Seleccione una opción"
                            onChange={(val) => {
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
                            }}
                        >
                            {options(title)}
                        </Select>
                    ) : (
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
                    )}
                </>
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
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        axios.get('http://localhost:4000/all_users')
            .then((res) => {
                setData(res.data);
            }).catch((error) => console.error(error));
    }, [])

    const isEditing = (record) => record._id === editingKey;

    const edit = (record) => {

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

            let mVals = {
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

            if (key === "0" && row.name && row.lastName && row.email && row.password && row.age && mVals.gender && row.address && mVals["isCaregiver"] && mVals.userType) {

                const newUser = {
                    name: row.name,
                    lastName: row.lastName,
                    email: row.email,
                    password: row.password,
                    age: row.age,
                    gender: mVals["gender"],
                    address: row.address,
                    condition: [...mVals.condition],
                    isCaregiver: mVals["isCaregiver"],
                    institution: row.institution,
                    userType: mVals["userType"]
                }

                axios.post('http://localhost:4000/addUser', newUser)
                    .then((res) => {
                        newData.splice(index, 1, res.data.element);
                        setData(newData);
                        setEditingKey('');
                        selectedValues.forEach(column => {
                            if (column.key === "condition") {
                                column.values = [];
                            } else {
                                column.values = "";
                            }
                        })
                        message.success('Se ha creado el Usuario exitosamente');
                    })
                    .catch((error) => {
                        message.error('No se ha podido crear el Usuario');
                    });
            } else if (key !== "0" && row.name && row.lastName && row.email && row.password && row.age && mVals.gender && row.address && mVals["isCaregiver"] && mVals.userType) {

                axios.post('http://localhost:4000/editUser', { ...item, ...row, ...mVals })
                    .then((res) => {
                        newData.splice(index, 1, res.data);
                        setData(newData);
                        setEditingKey('');
                        selectedValues.forEach(column => {
                            if (column.key === "condition") {
                                column.values = [];
                            } else {
                                column.values = "";
                            }
                        })
                        message.success('Se modificó el Usuario exitosamente');
                    })
                    .catch((error) => {
                        message.error('No se ha podido modificar el Usuario');
                    });
            } else {
                message.warning('¡Debes completar todos los campos obligatorios!');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo); //Modificar esto, no puede ser por consola.
        }
    };

    const handleDelete = (key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item._id);
        if (key !== "0") {
            axios.post('http://localhost:4000/deleteUser', { _id: key })
                .then((res) => {
                    newData.splice(index, 1);
                    setData(newData);
                    message.success('Se ha eliminado el Usuario exitosamente');
                })
                .catch((error) => {
                    message.error('No se ha podido eliminar el Usuario');
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
            title: 'Apellido*',
            dataIndex: "lastName",
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
            title: 'Contraseña*',
            dataIndex: "password",
            ellipsis: true,
            key: "password",
            editable: true,
        },
        {
            title: 'Edad*',
            dataIndex: "age",
            key: "age",
            editable: true,
            sorter: (a, b) => a.age - b.age
        },
        {
            title: 'Sexo*',
            dataIndex: "gender",
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
            key: "condition",
            editable: true,
            sorter: (a, b) => a.condition.length - b.condition.length
        },
        {
            title: 'Tutor*',
            dataIndex: "isCaregiver",
            key: "isCaregiver",
            editable: true,
            sorter: (a, b) => a.isCaregiver.localeCompare(b.isCaregiver)
        },
        {
            title: 'Fundación',
            dataIndex: "institution",
            key: "institution",
            editable: true,
            sorter: (a, b) => a.institution.localeCompare(b.institution)
        },
        {
            title: 'Rol*',
            dataIndex: "userType",
            key: "userType",
            editable: true,
            sorter: (a, b) => a.userType.localeCompare(b.userType)
        },
        {
            title: 'Foto usuario',
            dataIndex: "userType",
            key: "userType",
            editable: true,
            sorter: (a, b) => a.userType.localeCompare(b.userType)
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
                age: "",
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
            message.error('Ya se encuentra creando un Usuario. Finalice la creación o elimine el registro añadido');
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
                /*options={options}
                onSelect={onSelect}
                onSearch={handleSearch}*/
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

export default ManageUsers;