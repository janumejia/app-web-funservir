import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios'; // Ojo, se usa un archivo axios personalizado, para no tener que poner localhost:4000 a cada rato
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
                                    required: true,
                                    message: `¡Introduzca un nombre válido!`,
                                    pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
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


const ManageLocations = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");

    // Solicitar registros de localidades al servidor
    useEffect(() => {
        axios.get('/getLocations', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setData(res.data);
            }).catch((error) => {
                message.error('No se pudieron cargar los datos');
                console.error(error);
            });
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

            if (key === "0" && row.name) { // Si el campo nombre tiene información...

                const newLocation = { // Creación del sitio a agregar
                    name: row.name,
                }

                axios.post('/addLocations', newLocation, { headers: { 'token': localStorage.getItem("token") } })
                    .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

                        if (res.status === 200) {
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
                            message.success(res.data.message);
                        } else message.warning(res.status + " - Respuesta del servidor desconocida");
                    })
                    .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                        if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                        else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                        else message.warning(error.response.status + " - Respuesta del servidor desconocida");
                    });
            } else if (key !== "0" && row.name) {

                axios.post('/editLocations', { ...item, ...row, ...mVals }, { headers: { 'token': localStorage.getItem("token") } })
                    .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)

                        // Respuesta OK
                        if (res.status === 200) {
                            newData.splice(index, 1, res.data.ans);
                            setData(newData);
                            setEditingKey('');
                            selectedValues.forEach(column => {
                                if (column.key === "condition") {
                                    column.values = [];
                                } else {
                                    column.values = "";
                                }
                            })
                            message.success(res.data.message);
                        } else message.warning(res.status + " - Respuesta del servidor desconocida");
                    })
                    .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
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
            axios.post('/deleteLocations', { _id: key }, { headers: { 'token': localStorage.getItem("token") } })
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
        } else {
            newData.splice(index, 1);
            setData(newData);
            message.success('Se ha eliminado la categoría exitosamente');
        }
    };

    const columns = [
        {
            title: 'Nombre*',
            dataIndex: "name",
            key: "name",
            editable: true,
            width: "90%",
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
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
            // fixed: "right",
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
            message.error('Ya se encuentra creando una categoría. Finalice la creación o elimine el registro añadido');
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
                    Añadir Localidad
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
                scroll={{ x: 100 }}
            />
        </Form>
    );
};

export default ManageLocations;