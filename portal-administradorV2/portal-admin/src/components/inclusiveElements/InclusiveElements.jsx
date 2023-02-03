import React, { useState, useEffect } from 'react';
import axios from '../../api/axios'; // Ojo, se usa un archivo axios personalizado, para no tener que poner http://localhost:4000 a cada rato
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, message, AutoComplete, Modal, Upload } from 'antd';
import UploadComponent from './UploadComponent';

const rules = (dataIndex) => {
    if (dataIndex === 'name') {
        return (/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/);
    }
};

const ManageElements = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [editingKey, setEditingKey] = useState('');
    const [searchedText, setSearchedText] = useState("");
    //Inicio de Manejo de imagenes
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    //Tratamiento de imagenes
    const getBase64 = (img) => {
        const reader = new FileReader();

        if (img) {
            reader.readAsDataURL(img);
            reader.onloadend = () => {
                setImageUrl(reader.result);
                setLoading(false);
            }
        }

    };

    const handleChange = (info) => {

        const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('¡Solo puedes subir imagenes!');
        } else {
            getBase64(info.file);
        }

        /*const isLt2M = info.file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('La imagen debe ser menor a 2MB!');
        }*/
    };
    //Fin de manejo de imagenes

    useEffect(() => {
        axios.get('/elements', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setData(res.data);
            }).catch((error) => console.error(error));
    }, [])

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
        const inputNode = (inputType === 'object' ? <UploadComponent loading={loading} handleChange={handleChange} imageUrl={imageUrl} /> : <Input />);
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}

                        rules={title !== "Icono*" ? [
                            {
                                required: true,
                                message: `¡Introduzca un ${title} válido!`,
                                pattern: rules(dataIndex),
                            },
                        ] : []}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    
                    (inputType === 'object' ? <img src={record.image.url} alt='' style={{ width: 'auto', height: '70px' }} /> : children)
            
                )}
            </td>
        );
    };
    const isEditing = (record) => record._id === editingKey;

    const edit = (record) => {

        form.setFieldsValue({
            ...record
        });

        setEditingKey(record._id);
        setImageUrl(record.image.secure_url)
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

            if (key === "0" && row.name !== " " && imageUrl) {
                const newElement = {
                    name: row.name,
                    image: imageUrl
                }
                axios.post('/addElement', newElement, { headers: { 'token': localStorage.getItem("token") } })
                    .then((res) => {
                        newData.splice(index, 1, res.data.element);
                        setData(newData);
                        setImageUrl("");
                        setEditingKey('');
                        message.success('Se ha creado el Elemento Inclusivo exitosamente');
                    })
                    .catch((error) => {
                        if(error.response?.status === 409){
                            message.warning('Ya existe otro elemento inclusivo con ese nombre');
                        } else {
                            message.error('No se ha podido crear el Elemento Inclusivo');

                        }
                        console.log("error: ", error)
                    });
            } else if (key !== "0") {
                axios.post('/editElement', { ...item, ...row, imageUrl }, { headers: { 'token': localStorage.getItem("token") } })
                    .then((res) => {
                        newData.splice(index, 1, res.data);
                        setData(newData);
                        setImageUrl("");
                        setEditingKey('');
                        message.success('Se editó el Elemento Inclusivo exitosamente');
                    })
                    .catch((error) => {
                        if(error.response?.status === 409){
                            message.warning('Ya existe otro elemento inclusivo con ese nombre');
                        } else {
                            message.error('No se ha podido crear el Elemento Inclusivo');
                        }
                    });
            } else {
                message.warning('¡Debes completar todos los campos obligatorios en un formato valido!');
            }
        } catch (errInfo) {
            message.warning('¡Debes completar todos los campos obligatorios en un formato valido!');
            // console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item._id);
        if (key !== "0") {
            axios.post('/deleteElement', { _id: key._id, name: key.name }, { headers: { 'token': localStorage.getItem("token") } })
                .then((res) => {
                    newData.splice(index, 1);
                    setData(newData);
                    message.success('Se ha eliminado el Elemento Inclusivo exitosamente');
                })
                .catch((error) => {
                    message.error('No se ha podido eliminar el Elemento Inclusivo');
                });
        } else {
            newData.splice(index, 1);
            setData(newData);
            message.success('Se ha eliminado el Elemento Inclusivo exitosamente');
        }
    };

    const columns = [
        {
            title: 'Nombre*',
            dataIndex: "name",
            key: "name",
            width: '50%',
            editable: true,
            sorter: (a, b) => a.name.localeCompare(b.name),
            filteredValue: [searchedText],
            onFilter: (value, record) => {
                return String(record.name).toLocaleLowerCase().includes(value.toLocaleLowerCase())
            }
        },
        {
            title: 'Icono*',
            dataIndex: ['image', 'url'],
            key: "image",
            width: '40%',
            editable: true,
        },

        {
            title: 'Operación',
            dataIndex: 'operation',
            key: "operation",
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
                        <Popconfirm title="¿Estás seguro?" cancelText="Cancelar" onConfirm={() => handleDelete(record)}>
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
                inputType: (col.key === 'image' ? 'object' : 'text'),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    const handleAdd = () => {
        const index = data.findIndex((item) => "0" === item._id);
        if (index === -1 && editingKey === "") {
            const newElement = {
                _id: "0",
                name: "",
                image: {},
            };
            setData([...data, newElement]);
            edit(newElement);
        } else {
            message.error('Ya se encuentra creando o editando un Elemento Inclusivo. Finalice la creación o elimine el registro añadido');
        }
    };


    return (
        <>
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
                        Añadir Elemento Inclusivo
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
                    scroll={{ x: "max-content" }}
                />
            </Form>

        </>
    );
};

export default ManageElements;