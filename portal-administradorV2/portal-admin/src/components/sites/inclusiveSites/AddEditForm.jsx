import { Button, Form, Input, message, Space } from 'antd';
import MapOfGoogleMaps from './MapOfGoogleMaps';

const AddEditInclusiveSite = (props) => {
    const [form] = Form.useForm();
    //Mirar esa propiedad "warningOnly"



    return (
        <Form
            form={form}
            layout="vertical"
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
                    },
                    {
                        type: 'string',
                        min: 6,
                    },
                ]}
            >
                <Input placeholder="Ingrese el nombre del sitio" />
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
                <Input placeholder="Ingrese la descripción del sitio" />
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
                <Input placeholder="Ingrese la descripción del sitio" />
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
                <Input placeholder="Ingrese número de contacto del sitio" />
            </Form.Item>
            <Form.Item
                name="inclusiveElements"
                label="Elementos Inclusivos"
                rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                    },
                ]}
            >
                <Input placeholder="Elija los elementos inclusivos que posee el sitio" />
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
                <MapOfGoogleMaps />
                {/* <Input placeholder="Ingrese las coordenadas del sitio separadas por coma ',' " /> */}
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
                <Input placeholder="Elija la localidad del sitio" />
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
                <Input placeholder="Elija el barrio del sitio" />
            </Form.Item>
            <Form.Item
                name="gallery"
                label="Galeria"
                rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                    },
                ]}
            >
                <Input placeholder="Imagenes del sitio" />
            </Form.Item>


        </Form>
    )
}

export default AddEditInclusiveSite;