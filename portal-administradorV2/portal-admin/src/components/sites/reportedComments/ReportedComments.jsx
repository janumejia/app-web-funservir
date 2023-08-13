import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios'; // Ojo, se usa un archivo axios personalizado, para no tener que poner localhost:4000 a cada rato
import "antd/dist/antd.min.css";
import './index.css';
import { Form, Input, Popconfirm, Table, Typography, Button, Space, Select, message, AutoComplete, Tooltip, Tag } from 'antd';


const { Option } = Select;

let associatedLocalities = []; // Se llena abajo con una petición al backend para que traiga todas las localidades registradas. Y será un arreglo de objetos de tipo <Option>

// const options = (title) => {
//     if (title === "Localidad asociada*") {
//         return associatedLocalities;
//     }
// }

// // const selectedValues = [
// //     {
// //         title: "Sexo*",
// //         key: "gender",
// //         values: ""
// //     },
// //     {
// //         title: "Discapacidad",
// //         key: "condition",
// //         values: []
// //     },
// //     {
// //         title: "Rol*",
// //         key: "userType",
// //         values: ""
// //     },
// //     {
// //         title: "Tutor*",
// //         key: "isCaregiver",
// //         values: ""
// //     },
// //     {
// //         title: "Localidad asociada*",
// //         key: "associatedLocality",
// //         values: ""
// //     }
// // ]

// const rules = (dataIndex) => {
//     if (dataIndex === 'name') {
//         return (/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/);
//     }
// };

// const EditableCell = ({
//     editing,
//     dataIndex,
//     title,
//     inputType,
//     record,
//     index,
//     children,
//     ...restProps
// }) => {
//     // const inputNode = dataIndex === "password" ? <Input.Password /> : <Input />;
//     // return (
//     //     <td {...restProps}>
//     //         {editing ? (
//     //             <>
//     //                 {(title === "Sexo*" || title === "Localidad asociada*" || title === "Rol*" || title === "Tutor*") ? (
//     //                     <Select
//     //                         mode={(title === "Discapacidad") ? "multiple" : ""}
//     //                         allowClear={(title === "Discapacidad") ? true : false}
//     //                         style={{
//     //                             width: '100%',
//     //                         }}
//     //                         placeholder="Seleccione una opción"
//     //                         onChange={(val) => {
//     //                             const col = selectedValues.find(column => column.title === title);
//     //                             if (title === "Discapacidad") {
//     //                                 let newArray = [...val]
//     //                                 if (col.values.includes([...val])) {
//     //                                     newArray = newArray.filter(disa => disa !== [...val])
//     //                                 }
//     //                                 col["values"] = newArray;
//     //                             } else if (title === "Sexo*" || title === "Rol*" || title === "Tutor*") {
//     //                                 col["values"] = val;

//     //                             }
//     //                         }}
//     //                     >
//     //                         {options(title)}
//     //                     </Select>
//     //                 ) : (
//     //                     <Form.Item
//     //                         name={dataIndex}
//     //                         style={{
//     //                             margin: 0,
//     //                         }}
//     //                         rules={[
//     //                             {
//     //                                 required: (title === 'Fundación') ? false : true,
//     //                                 message: `¡Introduzca un ${title} válido!`,
//     //                                 pattern: rules(dataIndex),
//     //                             },
//     //                         ]}
//     //                     >
//     //                         {inputNode}
//     //                     </Form.Item>
//     //                 )}
//     //             </>
//     //         ) : (
//     //             children
//     //         )}
//     //     </td>
//     // );

//     // console.log("dataIndex")
//     // console.log(dataIndex)

//     // console.log("index")
//     // console.log(index)

//     // console.log("...restProps")
//     // console.log(restProps)


//     return (
//         <td {...restProps}>
//             {editing ? (
//                 <>
//                     {(title === "Localidad asociada*") ? (
//                         <Form.Item
//                             name={dataIndex}
//                             style={{
//                                 margin: 0,
//                             }}>
//                             <Select
//                                 // defaultValue=""
//                                 // mode=""
//                                 allowClear={true}
//                                 style={{
//                                     width: '100%',
//                                 }}
//                                 placeholder="Seleccione una opción"
//                             // onChange={(val) => {
//                             //     const col = selectedValues.find(column => column.title === "Localidad asociada*");
//                             //     console.log(selectedValues)
//                             //     // let newArray = [...val]
//                             //     // if (col.values.includes([...val])) {
//                             //     //     newArray = newArray.filter(disa => disa !== [...val])
//                             //     // }
//                             //     // col["values"] = newArray;

//                             //     col["values"] = val;

//                             // }}
//                             >
//                                 {options("Localidad asociada*")}
//                             </Select>
//                         </Form.Item>
//                     ) : (
//                         <Form.Item
//                             name={dataIndex}
//                             style={{
//                                 margin: 0,
//                             }}
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: `¡Introduzca un barrio válido!`,
//                                     pattern: rules(dataIndex),
//                                 },
//                             ]}
//                         >
//                             <Input />
//                         </Form.Item>
//                     )}
//                 </>
//             ) : (
//                 children
//             )}
//         </td>
//     );

// };


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

    // También traemos las localidades disponibles
    let arrayLocations = [];
    let allLocations = [];
    useEffect(() => {
        axios.get('/getReportedComments', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                allLocations = res.data;

                for (let pos = 0; pos < allLocations.length; pos++) {

                    arrayLocations[pos] = <Option key={allLocations[pos].name} value={allLocations[pos].name}>{allLocations[pos].name}</Option>
                }

                associatedLocalities = arrayLocations;

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
            width: "10%",
            editable: false,
            render: (e) => {
                return e.name;
            }
            // filteredValue: [searchedText],
            // onFilter: (value, record) => {
            //     return String(record.title).toLocaleLowerCase().includes(value.toLocaleLowerCase())
            // }
        },
        {
            title: 'Autor',
            dataIndex: "userId",
            key: "autor",
            width: "5%",
            editable: false,
            render: (e) => {
                return e.name + " " + e.lastName + " - " + e.email;
            }
            // filteredValue: [searchedText],
            // onFilter: (value, record) => {
            //     return String(record.title).toLocaleLowerCase().includes(value.toLocaleLowerCase())
            // }
        },
        {
            title: 'Titulo',
            dataIndex: "title",
            key: "title",
            width: "10%",
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
            width: "45%",
            editable: false,
            sorter: (a, b) => a.content.length - b.content.length
        },
        {
            title: 'Cantidad de reportes',
            dataIndex: "reportedBy",
            key: "reportedAmount",
            width: "3%",
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
            width: "10%",
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
                // const editable = isEditing(record);
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


    // const handleAdd = () => {
    //     const index = data.findIndex((item) => "0" === item._id);
    //     if (index === -1 && editingKey === "") {
    //         const newN = {
    //             _id: "0",
    //             name: "",
    //             associatedLocality: [],
    //         };
    //         setData([...data, newN]);
    //         edit(newN);
    //     } else {
    //         message.error('Ya se encuentra creando o editando un barrio. Finalice la creación o elimine el registro añadido');
    //     }
    // };
    return (
        <Form form={form} component={false}>
            <Space align="start" wrap={true}>
                {/* <Button
                    onClick={handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                    size='large'
                >
                    Añadir barrio
                </Button> */}
                <div>
                    Comentarios reportados por otros usuarios
                </div>
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
                // components={{
                //     body: {
                //         cell: EditableCell,
                //     },
                // }}
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