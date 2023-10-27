import { Button, Form, Input, message, Space, Select, Popconfirm, TimePicker, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import MapOfGoogleMaps from './MapOfGoogleMaps';
import axios from "../../../api/axios";
import { useContext, useEffect, useState } from 'react';
import UploadImage from './UploadImage';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import UncheckedSitesContext from "../../../context/UncheckedSitesProvider";
import {
    IoLogoWhatsapp,
    IoLogoTwitter,
    IoLogoFacebook,
    IoLogoInstagram,
} from 'react-icons/io';
import { FaXTwitter } from 'react-icons/fa6';

const AddEditInclusiveSite = ({ site }) => {
    const [form] = Form.useForm();
    //Mirar esa propiedad "warningOnly"
    const [latlng, setLatLng] = useState(site.location);
    const [arrayBase64, setArrayBase64] = useState([]);
    const [previousImagesPreserved, setPreviousImagesPreserved] = useState([]);
    const [siteStatus, setSiteStatus] = useState(site.status)
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState({
        Lunes: site.schedule && site.schedule["Lunes"] ? site.schedule["Lunes"] : { start: null, end: null },
        Martes: site.schedule && site.schedule["Martes"] ? site.schedule["Martes"] : { start: null, end: null },
        Miercoles: site.schedule && site.schedule["Miercoles"] ? site.schedule["Miercoles"] : { start: null, end: null },
        Jueves: site.schedule && site.schedule["Jueves"] ? site.schedule["Jueves"] : { start: null, end: null },
        Viernes: site.schedule && site.schedule["Viernes"] ? site.schedule["Viernes"] : { start: null, end: null },
        Sabado: site.schedule && site.schedule["Sabado"] ? site.schedule["Sabado"] : { start: null, end: null },
        Domingo: site.schedule && site.schedule["Domingo"] ? site.schedule["Domingo"] : { start: null, end: null },
    });
    const { updateUncheckedSites } = useContext(UncheckedSitesContext);

    const updateInfoSite = async (row) => {
        try {

            if (!row.inclusiveElements) row.inclusiveElements = []

            message.open({
                key: 'key-loading',
                type: 'loading',
                content: 'Subiendo archivos, espera un momento',
                duration: 0
            });

            if (site._id === "0") {
                try {
                    const res = await axios.post('/addInclusiveSites', { ...row, "location": latlng, "imgToAdd": arrayBase64, "schedule": schedule }, { headers: { 'token': localStorage.getItem("token") } });
                    message.destroy("key-loading")
                    if (res.status === 200) {
                        message.success(res.data.message);
                        await updateUncheckedSites();
                    } else message.warning(res.status + " - Respuesta del servidor desconocida");

                } catch (error) {
                    message.destroy("key-loading")
                    if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                    else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                    else message.warning("Respuesta del servidor desconocida");
                }
            } else if (site._id !== "0") {

                const imgToDelete = []; // Aquí almacenamos los códigos asset_id de las imágenes que queremos borrar
                for (let index = 0; index < site.gallery.length; index++) {
                    const found = previousImagesPreserved.find(element => element.uid === site.gallery[index].asset_id);
                    if (found === undefined) imgToDelete.push(site.gallery[index].public_id); // Aqui le podemos cambiar la propiedad de la imagen que queremos borrar. En este caso de asset_id
                }

                try {
                    const res = await axios.post('/editInclusiveSites', { ...site, ...row, "location": latlng, "imgToAdd": arrayBase64, "imgToDelete": imgToDelete, "schedule": schedule }, { headers: { 'token': localStorage.getItem("token") } });
                    message.destroy("key-loading")
                    if (res.status === 200) {
                        message.success(res.data.message);
                        await updateUncheckedSites();
                        setSiteStatus("Aprobado");
                    } else message.warning(res.status + " - Respuesta del servidor desconocida");
                } catch (error) {
                    message.destroy("key-loading")
                    if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                    else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                    else message.warning("Respuesta del servidor desconocida");
                }
            }
        } catch (errInfo) {
            message.destroy("key-loading")
            message.warning('¡Debes completar todos los campos en un formato válido!');
        }
    }

    const action = async () => {
        const row = await form.validateFields();
        row.status = "Aprobado";

        await updateInfoSite(row);
    }

    const actionReject = async () => {
        const row = await form.validateFields();
        row.status = "Rechazado";

        await updateInfoSite(row);
    };


    // Para ajustar las opciones disponibles
    const [availableElements, setAvailableElements] = useState([]);
    const [availableLocalities, setAvailableLocalities] = useState([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableUsers, setavailableUsers] = useState([]);


    const selectedLocality = Form.useWatch("locality", form);

    useEffect(() => {
        if (site.locality !== selectedLocality && selectedLocality !== undefined) {
            form.setFieldValue("neighborhood", "");
        }
    }, [selectedLocality])

    // Traemos todos los elementos, localidades y barrios disponibles para escoger
    useEffect(() => {
        const fetchData = async () => {

            if (siteStatus === "Pendiente") {
                await message.warning(
                    <span>
                        Sitio de interés en estado <span style={{ fontWeight: 'bold' }}>pendiente</span>. Revísalo y apruébalo o recházalo.
                    </span>
                    , 4);
            }

            try {
                const elements = await axios.get('/elements', { headers: { 'token': localStorage.getItem("token") } });
                setAvailableElements(elements.data);

                const locations = await axios.get('/getLocations', { headers: { 'token': localStorage.getItem("token") } });
                setAvailableLocalities(locations.data);

                const neighborhoods = await axios.get('/getNeighborhoods', { headers: { 'token': localStorage.getItem("token") } });
                setAvailableNeighborhoods(neighborhoods.data);

                const categories = await axios.get('/getCategories', { headers: { 'token': localStorage.getItem("token") } });
                setAvailableCategories(categories.data);

                const users = await axios.get('/all_users', { headers: { 'token': localStorage.getItem("token") } });
                setavailableUsers(users.data);
            } catch (error) {
                message.error('No se pudieron cargar los datos de selección');
                console.error(error);
            }
        }

        fetchData();
    }, [])

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    "name": site.name,
                    "description": site.description,
                    "category": site.category,
                    "contactNumber": site.contactNumber,
                    "contactNumber2": site?.contactNumber2 ?? "",
                    "inclusiveElements": site.inclusiveElements.map(obj => obj._id),
                    "moreInfoInclusivity": site.moreInfoInclusivity ? site.moreInfoInclusivity : "",
                    "socialWhatsapp": site?.socialWhatsapp ?? "",
                    "socialTwitter": site?.socialTwitter ?? "",
                    "socialFacebook": site?.socialFacebook ?? "",
                    "socialInstagram": site?.socialInstagram ?? "",
                    "webpage": site?.webpage ?? "",
                    "siteAddress": site.siteAddress,
                    "location": (site.location) ? site.location.lat + "," + site.location.lng : "",
                    "locality": site.locality,
                    "neighborhood": site.neighborhood,
                    "gallery": site.gallery,
                    "owner": (site?.owner) ? site.owner._id : ""
                }}
            >
                <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[
                        {
                            required: true,
                            message: `¡Introduzca un nombre válido!`,
                            pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,255}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input name="name" placeholder="Ingrese el nombre del sitio" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Descripción"
                    rules={[
                        {
                            required: true,
                            message: `¡Introduzca un descripción válida!`,
                            pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){1,2000}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        description="description"
                        placeholder="Ingrese la descripción del sitio"
                    />
                </Form.Item>
                <Form.Item
                    name="category"
                    label="Categoria"
                    rules={[
                        {
                            required: true,
                            message: `¡Introduzca un categoría válida!`,
                            // pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Select > {/* listHeight={600}  por si quiere poner mas sugerencias*/}
                        {availableCategories.map(element => {
                            return (
                                <Select.Option key={element.name} value={element.name}>{element.name}</Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="contactNumber"
                    label="Número de contacto"
                    rules={[
                        {
                            required: true,
                            message: `¡Introduzca un número de contacto válido!`,
                            pattern: /^\d{10}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input addonBefore="+57" contactnumber="contactNumber" placeholder="Ingrese el número de contacto del sitio" />
                </Form.Item>
                <Form.Item
                    name="contactNumber2"
                    label="Segundo número de contacto"
                    rules={[
                        {
                            required: false,
                            message: `¡Introduzca un número de contacto válido!`,
                            pattern: /^\d{10}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input addonBefore="+57" contactnumber2="contactNumber2" placeholder="Ingrese el segundo número de contacto del sitio" />
                </Form.Item>
                <Form.Item
                    name="inclusiveElements"
                    label="Elementos Inclusivos"
                    rules={[
                        {
                            required: false,
                            message: `¡Seleccione al menos un elemento inclusivo!`,
                            // pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                            // type: 'string'
                        }
                    ]}
                >
                    <Select mode="multiple">
                        {availableElements.map(element => {
                            return (
                                <Select.Option key={element.name} value={element._id}>{element.name}</Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="moreInfoInclusivity"
                    label="Más información sobre inclusividad del sitio"
                    rules={[
                        {
                            // required: true,
                            message: `¡Introduzca un texto válido!`,
                            pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){0,500}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input.TextArea
                        rows={2}
                        moreInfoInclusivity="moreInfoInclusivity"
                        placeholder="Ingrese algo más sobre la inclusividad del sitio"
                    />
                    {/* <Input moreInfoInclusivity="moreInfoInclusivity" placeholder="Ingrese algo más sobre la inclusividad del sitio" /> */}
                </Form.Item>
                <Form.Item
                    name="siteSchedule"
                    label="Horario del sitio"
                >
                    {Object.keys(schedule).map((day) => (
                        <Row gutter={[16, 16]}>
                            <Col span={3}>
                                {day}:
                            </Col>
                            <Col span={9}>
                                <Form.Item name={day} key={day}>
                                    <TimePicker.RangePicker
                                        defaultValue={[
                                            schedule[day].start ? moment(schedule[day].start, "HH:mm") : null,
                                            schedule[day].end ? moment(schedule[day].end, "HH:mm") : null
                                        ]}
                                        format="HH:mm"
                                        onChange={async (value) => {
                                            const updatedSchedule = { ...schedule };
                                            if (value) {
                                                updatedSchedule[day] = { start: value[0]._d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), end: value[1]._d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) };
                                            } else {
                                                updatedSchedule[day] = { start: null, end: null };
                                            }
                                            setSchedule(updatedSchedule);
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    ))}
                </Form.Item>

                <Form.Item
                    name="socialWhatsapp"
                    label="WhatsApp"
                    rules={[
                        {
                            message: `¡Introduzca un número válido!`,
                            pattern: /^\d{10}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input
                        addonBefore={
                            (<div style={{ display: 'flex', alignItems: 'center' }}>
                                <IoLogoWhatsapp style={{ fill: "#21b639", verticalAlign: 'middle' }} />
                                <div style={{ verticalAlign: 'middle', marginLeft: '5px' }}>+57</div>
                            </div>)
                        }
                        socialWhatsapp="socialWhatsapp"
                        placeholder="Ingrese la dirección del sitio"

                    />
                </Form.Item>
                <Form.Item
                    name="socialTwitter"
                    label="X (Twitter)"
                    rules={[
                        {
                            message: `¡Formato de red social no valido!`,
                            pattern: /^(?:https:\/\/)(?:www\.)?twitter\.com\/([a-zA-Z0-9_]){1,255}[\/]{0,1}$|^$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input addonBefore={(<FaXTwitter style={{ fill: "#0f1419" }} />)} socialTwitter="socialTwitter" placeholder="Ingrese la URL de la red social" />
                </Form.Item>
                <Form.Item
                    name="socialFacebook"
                    label="Facebook"
                    rules={[
                        {
                            message: `¡Formato de red social no valido!`,
                            pattern: /^(?:https:\/\/)(?:www\.)?facebook\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$|^$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input addonBefore={(<IoLogoFacebook style={{ fill: "#3b5998" }} />)} socialFacebook="socialFacebook" placeholder="Ingrese la URL de la red social" />
                </Form.Item>
                <Form.Item
                    name="socialInstagram"
                    label="Instagram"
                    rules={[
                        {
                            message: `¡Formato de red social no valido!`,
                            pattern: /^(?:https:\/\/)(?:www\.)?instagram\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$|^$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input addonBefore={(<IoLogoInstagram style={{ fill: "#e4405f" }} />)} socialInstagram="socialInstagram" placeholder="Ingrese la URL de la red social" />
                </Form.Item>
                <Form.Item
                    name="webpage"
                    label="Página web"
                    rules={[
                        {
                            message: `¡Introduzca una URL válida!`,
                            pattern: /(^(https:\/\/)[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+(\/[a-zA-Z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~]*)?$)|(^$)/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input webpage="webpage" placeholder="Ingrese la URL del sitio web" />
                </Form.Item>
                <Form.Item
                    name="siteAddress"
                    label="Dirección"
                    rules={[
                        {
                            required: true,
                            message: `¡Introduzca una dirección válida!`,
                            pattern: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚü\s.,-/#-]{5,255}$/,
                            type: 'string'
                        }
                    ]}
                >
                    <Input siteAddress="siteAddress" placeholder="Ingrese la dirección del sitio" />
                </Form.Item>
                <Form.Item
                    name="locality"
                    label="Localidad"
                    rules={[
                        {
                            required: true,
                            message: `¡Seleccione una localidad!`,
                        },
                        {
                            type: 'string',
                        },
                    ]}
                >
                    <Select>
                        {availableLocalities.map(locality => {
                            return (
                                <Select.Option key={locality.name} value={locality.name}>{locality.name}</Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="neighborhood"
                    label="Barrio"
                    rules={[
                        {
                            required: true,
                            message: `¡Seleccione un barrio!`,
                        },
                        {
                            type: 'string',
                        },
                    ]}
                >
                    <Select>
                        {availableNeighborhoods.map(neighborhood => {
                            if (neighborhood.associatedLocality === selectedLocality) {
                                return (
                                    <Select.Option key={neighborhood.name} value={neighborhood.name}>{neighborhood.name}</Select.Option>
                                )
                            }
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ubicación en el mapa"
                    rules={[
                        {
                            required: true,
                            message: `¡Seleccione una ubicación!`,
                        },
                        {
                            type: 'string',
                        },
                    ]}
                >
                    <MapOfGoogleMaps latlng={latlng} setLatLng={setLatLng} />
                    <Input size="large" disabled={true} bordered={false} placeholder="Vació" value={JSON.stringify(latlng)} />
                </Form.Item>
                <Form.Item
                    name="owner"
                    label="Dueño del sitio"
                    rules={[
                        {
                            // required: true,
                            message: `¡Introduzca un nombre de dueño válido!`,
                            type: 'string'
                        }
                    ]}
                >
                    <Select>
                        <Select.Option key={"vacio"} value={""}>{""}</Select.Option>
                        {availableUsers.map(element => {
                            if (element.userType === "Administrador" || element.userType === "Propietario") {
                                return (
                                    <Select.Option key={element._id} value={element._id}>{element.name + " " + element.lastName}</Select.Option>
                                )
                            }
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="gallery"
                    label="Galeria"
                >
                    <UploadImage gallery={site.gallery} setArrayBase64={setArrayBase64} setPreviousImagesPreserved={setPreviousImagesPreserved} />
                </Form.Item>
                {siteStatus === "Pendiente" ? (
                    <Space style={{ margin: "20px", display: "inline-grid" }} size={20}>
                        <Popconfirm title="¿Estás seguro?" okText="Aprobar" cancelText="Seguir revisando" onConfirm={action}>
                            <Button icon={<CheckOutlined />} type="primary">
                                Aprobar
                            </Button>
                        </Popconfirm>

                        <Popconfirm title="¿Estás seguro de rechazar el sitio?" okText="Rechazar" cancelText="Seguir revisando" onConfirm={actionReject}>
                            <Button icon={<CloseOutlined />} danger>
                                Rechazar
                            </Button>
                        </Popconfirm>
                    </Space>
                ) : (
                    <Space style={{ margin: "20px" }} >
                        <Popconfirm title="¿Estás seguro?" okText="Guardar" cancelText="Seguir editando" onConfirm={action}>
                            <Button type="primary">
                                Guardar
                            </Button>
                        </Popconfirm>
                    </Space>
                )}
            </Form>
        </>
    )
}

export default AddEditInclusiveSite;