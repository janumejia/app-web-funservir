import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Select, Button, Checkbox, Divider, message, DatePicker } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
// import DatePicker from 'components/UI/AntdDatePicker/AntdDatePicker';
import { FormTitle } from './AccountSettings.style';
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { AuthContext } from 'context/AuthProvider';
import axios from "../../../settings/axiosConfig"; // Para la petición de registro

const genderOptions = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Femenino', value: 'Femenino' },
  { label: 'Otro', value: 'Otro' },
];

const isCaregiverOptions = [
  { label: 'Si', value: 'Si' },
  { label: 'No', value: 'No' },
];

const AgentCreateOrUpdateForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { user, setUser } = useContext(AuthContext);
  // const [userInfo, setUserInfo] = useState({})

  const onSubmit = async (data) => {
    try {

      data.dateOfBirth = data && data.dateOfBirth && data.dateOfBirth.$d ? data.dateOfBirth.$d : user.dateOfBirth;

      message.loading("Cargando", 0);
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/updateUserInfo`, data);
      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 3);

          let updatedUser = { // Poner los valores que tiene actualmente el usuario y agregar los que nos llega del back
            ...user,
            ...res.data.data
          }
          setUser(updatedUser);

        } else message.warning("Respuesta del servidor desconocida", 3);
      }
    } catch (error) {
      message.destroy();
      if (!error.response || (error.response && typeof error.response.status === 'undefined')) {

        message.warning({ content: "Error de conectividad con el servidor", duration: 3 });
      } else {
        if (error.response.status >= 400 && error.response.status <= 499) { // Errores del cliente

          message.warning({ content: error.response.data.message, duration: 3 });
        }
        else if (error.response.status >= 500 && error.response.status <= 599) {

          message.error({ content: error.response.data.message, duration: 3 });
        } // Errores del servidor
        else {
          message.warning({ content: "Error de conectividad con el servidor", duration: 3 });
        }
      }
    }
  };

  return (
    <Fragment>
      <FormTitle>Información Básica</FormTitle>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              label="Nombre"
              htmlFor="name"
              error={
                errors.name && errors.name.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.name && errors.name.type === "pattern" ? (
                  <span>¡El nombre no está en un formato válido!</span>
                ) : null
              }
            >
              <Controller
                name="name"
                defaultValue={user && user.name ? user.name : ""}
                control={control}
                rules={{
                  required: true,
                  pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12}>
            <FormControl
              label="Apellido"
              htmlFor="lastName"
              error={
                errors.lastName && errors.lastName.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.lastName && errors.lastName.type === "pattern" ? (
                  <span>¡El apellido no está en un formato válido!</span>
                ) : null
              }
            >
              <Controller
                name="lastName"
                defaultValue={user && user.lastName ? user.lastName : ""}
                control={control}
                rules={{
                  required: true,
                  pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              label="Fecha de nacimiento"
              htmlFor="dateOfBirth"
              error={
                errors.dateOfBirth && <span>¡Este campo es requerido!</span>
              }
            >
              <Controller
                name="dateOfBirth"
                defaultValue={user && user.dateOfBirth ? moment(user.dateOfBirth.split("T")[0], 'YYYY-MM-DD') : ""}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DatePicker
                    value={value}
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                    }}
                    // onChange={(date) => {
                    //   onChange(date ? date.format('YYYY-MM-DD') : '');
                    // }}
                    placeholder="Selecciona una fecha"
                    showToday={false}
                    allowClear={false}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => {
                      // La función "disabledDate" recibe una fecha y debe devolver "true" si la fecha debe estar deshabilitada o "false" si la fecha debe estar habilitada.
                      // En este caso, solo permite fechas entre hace 200 años y hoy.
                      return current && (current < moment().subtract(200, 'years').startOf('day') || current > moment().endOf('day'));
                    }}
                  // defaultPickerValue={moment().subtract(30, 'years').startOf("day")}
                  // locale="es_ES" // set the locale to Spanish. No sirve :/
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12}>
            <FormControl
              label="Genero"
              htmlFor="gender"
              error={
                errors.gender && errors.gender.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.gender && errors.gender.type === "pattern" ? (
                  <span>¡El genero no está en un formato válido!</span>
                ) : null
              }
            >
              <Controller
                name="gender"
                defaultValue={user && user.gender ? user.gender : ""}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    options={genderOptions}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col lg={24}>
            <FormControl
              label="Correo electrónico"
              htmlFor="email"
            >
              <Controller
                name="email"
                defaultValue={user && user.email ? user.email : ""}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    disabled={true}
                    type="email"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          {/* <Col lg={12}>
            <FormControl
              label="Número telefónico"
              htmlFor="phoneNumber"
              error={
                errors.phoneNumber && (
                  <>
                    {errors.phoneNumber?.type === 'required' && (
                      <span>¡Este campo es requerido!</span>
                    )}
                    {errors.phoneNumber?.type === 'pattern' && (
                      <span>Please enter your valid number!</span>
                    )}
                  </>
                )
              }
            >
              <Controller
                name="phoneNumber"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                  pattern: /^[0-9]*$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col> */}
          <Col lg={24}>
            <FormControl
              label="Dirección de residencia"
              htmlFor="address"
              error={
                errors.address && errors.address.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.address && errors.address.type === "pattern" ? (
                  <span>¡La dirección no está en un formato válido!</span>
                ) : null
              }
            >
              <Controller
                name="address"
                defaultValue={user && user.address ? user.address : ""}
                control={control}
                rules={{
                  required: true,
                  pattern: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚü\s.,-/#-]{5,255}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={24}>
            <FormControl
              label="¿Tienes alguna limitación física o cognitiva? (Opcional)"
              htmlFor="condition"
              error={errors.condition && <span>¡Este campo es requerido!</span>}
              labelTag="h3"
            >
              <Controller
                name="condition"
                defaultValue={user && user.condition ? user.condition : ""}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <h2>
                    <Checkbox.Group
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                      }}
                      value={value}
                    >
                      <Checkbox value=" Motriz ">Motriz</Checkbox>
                      <Checkbox value=" Visual ">Visual</Checkbox>
                      <Checkbox value=" Auditiva ">Auditiva</Checkbox>
                      <Checkbox value=" Sensorial ">Sensorial</Checkbox>
                      <Checkbox value=" Comunicación ">Comunicación</Checkbox>
                      <Checkbox value=" Mental ">Mental</Checkbox>
                      <Checkbox value=" Múltiples ">Multiples</Checkbox>
                      <Checkbox value=" Otra ">Otra</Checkbox>
                    </Checkbox.Group>
                  </h2>
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12}>
            <FormControl
              label="¿Eres tutor de persona(s) con capacidades diferenciadas?"
              htmlFor="isCaregiver"
              error={
                errors.gender && <span>¡Este campo es requerido!</span>
              }
            >
              <Controller
                name="isCaregiver"
                defaultValue={user && user.isCaregiver ? user.isCaregiver : ""}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    options={isCaregiverOptions}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12}>
            <FormControl
              label="¿Perteneces a alguna fundación? (Opcional)"
              htmlFor="institution"
              error={
                errors.institution && errors.institution.type === "pattern" ? (
                  <span>¡El texto ingresado no está en un formato válido!</span>
                ) : null
              }
            >
              <Controller
                name="institution"
                defaultValue={user && user.institution ? user.institution : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü0-9 ]){0,255}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onChange={onChange} onBlur={onBlur} value={value} />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={24}>
            <FormControl
              label="Descríbete a ti mismo (Opcional)"
              htmlFor="describeYourself"
              error={
                errors.describeYourself && errors.describeYourself.type === "pattern" ? (
                  <span>¡El texto ingresado no está en un formato válido!</span>
                ) : null
              }
            >
              <Controller
                name="describeYourself"
                defaultValue={user && user.describeYourself ? user.describeYourself : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){0,2000}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.TextArea
                    placeholder="Proporciona una breve descripción de ti mismo y tus intereses para que las demás personas puedan conocerte mejor"
                    rows={5}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Divider />
        <FormTitle>Redes sociales (Opcional)</FormTitle>
        <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              // label="Instagram"
              htmlFor="socialInstagram"
              error={
                errors.socialInstagram && errors.socialInstagram.type === "pattern" ? (
                  <span>¡Enlace no válido para la red social!</span>
                ) : null
              }
            >
              <Controller
                name="socialInstagram"
                defaultValue={user && user.socialInstagram ? user.socialInstagram : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^(?:https?:\/\/)(?:www\.)?instagram\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InstagramOutlined style={{ fontSize: '24px' }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input onChange={onChange} onBlur={onBlur} value={value} placeholder='Instagram' />
                  </div>
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              // label="Instagram"
              htmlFor="socialFacebook"
              error={
                errors.socialFacebook && errors.socialFacebook.type === "pattern" ? (
                  <span>¡Enlace no válido para la red social!</span>
                ) : null
              }
            >
              <Controller
                name="socialFacebook"
                defaultValue={user && user.socialFacebook ? user.socialFacebook : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^(?:https?:\/\/)(?:www\.)?facebook\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FacebookOutlined style={{ fontSize: '24px' }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input onChange={onChange} onBlur={onBlur} value={value} placeholder='Facebook' />
                  </div>
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              // label="Instagram"
              htmlFor="socialTwitter"
              error={
                errors.socialTwitter && errors.socialTwitter.type === "pattern" ? (
                  <span>¡Enlace no válido para la red social!</span>
                ) : null
              }
            >
              <Controller
                name="socialTwitter"
                defaultValue={user && user.socialTwitter ? user.socialTwitter : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^(?:https?:\/\/)(?:www\.)?twitter\.com\/([a-zA-Z0-9_]){1,255}[\/]{0,1}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TwitterOutlined style={{ fontSize: '24px' }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input onChange={onChange} onBlur={onBlur} value={value} placeholder='Twitter' />
                  </div>
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <div className="submit-container">
          <Button htmlType="submit" type="primary">
            Guardar cambios
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default AgentCreateOrUpdateForm;
