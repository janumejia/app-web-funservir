import { Button, Form, Input, message, Space, Select } from 'antd';
import MapOfGoogleMaps from './MapOfGoogleMaps';
import axios from "../../../api/axios";
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import UploadImage from './UploadImage';

const AddEditInclusiveSite = ({ site }) => {
    const [form] = Form.useForm();
    //Mirar esa propiedad "warningOnly"

    const [latlng, setLatLng] = useState(site.location);
    const [arrayBase64, setArrayBase64] = useState([]);
    const [previousImagesPreserved, setPreviousImagesPreserved] = useState([]);

    const action = async () => {
        try {
            const row = await form.validateFields();

            if (site._id === "0") {
                axios.post('/addInclusiveSites', { ...row, "location": latlng, "imgToAdd": arrayBase64 }, { headers: { 'token': localStorage.getItem("token") } })
                .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)
                    if (res.status === 200) {
                        message.success(res.data.message);
                    } else message.warning(res.status + " - Respuesta del servidor desconocida");
                })
                .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                    if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                    else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                    else message.warning(error.response.status + " - Respuesta del servidor desconocida");
                });
            } else if (site._id !== "0") {

                const imgToDelete = []; // Aquí almacenamos los códigos asset_id de las imágenes que queremos borrar
                for (let index = 0; index < site.gallery.length; index++){
                    const found = previousImagesPreserved.find(element => element.uid === site.gallery[index].asset_id);
                    if (found === undefined) imgToDelete.push(site.gallery[index].asset_id); // Aqui le podemos cambiar la propiedad de la imagen que queremos borrar. En este caso de asset_id
                }

                axios.post('/editInclusiveSites', { ...site, ...row, "location": latlng, "imgToAdd": arrayBase64, "imgToDelete": imgToDelete }, { headers: { 'token': localStorage.getItem("token") } })
                    .then((res) => { // Aquí se manejan los códigos de respuesta buenas (200 - 399)
                        if (res.status === 200) {
                            message.success(res.data.message);
                        } else message.warning(res.status + " - Respuesta del servidor desconocida");
                    })
                    .catch((error) => { // Aquí se manejan los códigos de respuesta entre 400 y 599 (errores cliente y errores servidor)
                        if (error.response.status >= 400 && error.response.status <= 499) message.warning(error.response.data.message); // Errores del cliente
                        else if (error.response.status >= 500 && error.response.status <= 599) message.error(error.response.data.message); // Errores del servidor
                        else message.warning(error.response.status + " - Respuesta del servidor desconocida");
                    });
            }
        } catch (errInfo) {
            message.warning('¡Debes completar todos los campos en un formato válido!');
            console.log(errInfo)
        }
    }

    // Para ajustar las opciones disponibles
    const [availableElements, setAvailableElements] = useState([]);
    const [availableLocalities, setAvailableLocalities] = useState([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
    const [availableNeighInThatLocality, setAvailableNeighInThatLocality] = useState([]);


    const selectedLocality = Form.useWatch("locality", form);

    useEffect(() => {
        if(site.locality !== selectedLocality && selectedLocality !== undefined){
            form.setFieldValue("neighborhood", "");
        }
    }, [selectedLocality])

    // Traemos todos los elementos, localidades y barrios disponibles para escoger
    useEffect(() => {

        axios.get('/elements', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setAvailableElements(res.data);
            }).catch((error) => console.error(error));


        axios.get('/getLocations', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setAvailableLocalities(res.data);
            }).catch((error) => {
                message.error('No se pudieron cargar los datos');
                console.error(error);
            });


        axios.get('/getNeighborhoods', { headers: { 'token': localStorage.getItem("token") } })
            .then((res) => {
                setAvailableNeighborhoods(res.data);
            }).catch((error) => console.error(error));

    }, [])


    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                "name": site.name,
                "description": site.description,
                "category": site.category,
                "contactNumber": site.contactNumber,
                "inclusiveElements": site.inclusiveElements,
                "location": (site.location) ? site.location.lat + "," + site.location.lng : "",
                "locality": site.locality,
                "neighborhood": site.neighborhood,
                "gallery": site.gallery
            }}
        >
            <Form.Item
                name="name"
                label="Nombre"
                rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                        warningOnly: true,
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
                    },
                    {
                        type: 'string',
                    },
                ]}
            >
                <Input description="description" placeholder="Ingrese la descripción del sitio" />
            </Form.Item>
            <Form.Item
                name="category"
                label="Categoria"
                rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                    },
                ]}
            >
                <Input category="category" placeholder="Ingrese la descripción del sitio" />
            </Form.Item>
            <Form.Item
                name="contactNumber"
                label="Número de contacto"
                rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                    },
                ]}
            >
                <Input contactnumber="contactNumber" placeholder="Ingrese número de contacto del sitio" />
            </Form.Item>
            <Form.Item
                name="inclusiveElements"
                label="Elementos Inclusivos"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select>
                    {availableElements.map(element => {
                        return (
                            <Select.Option key={element.name} value={element.name}>{element.name}</Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item
                label="Ubicación"
                rules={[
                    {
                        required: true,
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
                name="locality"
                label="Localidad"
                rules={[
                    {
                        required: true,
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
                name="gallery"
                label="Galeria"
            >
                <UploadImage gallery={site.gallery} setArrayBase64={setArrayBase64} setPreviousImagesPreserved={setPreviousImagesPreserved}  />
            </Form.Item>
            <Space style={{ margin: "20px" }}>
                <Button type="primary" onClick={action}>
                    Guardar
                </Button>
            </Space>
        </Form>
    )
}

export default AddEditInclusiveSite;