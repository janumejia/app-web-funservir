import { Button, Form, Input, message, Space } from 'antd';
import MapOfGoogleMaps from './MapOfGoogleMaps';
import axios from "axios";
import { useState } from 'react';

const AddEditInclusiveSite = ({ site }) => {
    const [form] = Form.useForm();
    //Mirar esa propiedad "warningOnly"

    const [latlng, setLatLng] =  useState(site.location);

    const action = async () => {
        try {
            // site.location = latlng;
            // console.log(site.location)

            const row = await form.validateFields();
            if (site._id === 0) {

                axios.post('http://localhost:4000/addInclusiveSites', { ...row }, { headers: { 'token': localStorage.getItem("token") } })
            } else if (site._id !== "0") {
                axios.post('http://localhost:4000/editInclusiveSites', {...site, ...row, "location": latlng}, { headers: { 'token': localStorage.getItem("token") } }) 
            }
        } catch (errInfo) {
            message.warning('¡Debes completar todos los campos en un formato válido!');
        }
    }
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
                <Input inclusiveelements="inclusiveElements" placeholder="Elija los elementos inclusivos que posee el sitio" />
            </Form.Item>
            <Form.Item
                name="location"
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
                <MapOfGoogleMaps latlng={latlng} setLatLng={setLatLng}/>
                <Input size="large" disabled={true} bordered={false}  placeholder="Vació" value={JSON.stringify(latlng)} />
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
                <Input locality="locality" placeholder="Elija la localidad del sitio" />
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
                <Input neighborhood="neighborhood" placeholder="Elija el barrio del sitio" />
            </Form.Item>
            <Form.Item
                name="gallery"
                label="Galeria"
            >
                <Input gallery="gallery" placeholder="Imagenes del sitio" />
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