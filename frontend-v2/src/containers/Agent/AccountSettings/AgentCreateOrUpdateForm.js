import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Select, Button, Checkbox, Divider } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import DatePicker from 'components/UI/AntdDatePicker/AntdDatePicker';
import { FormTitle } from './AccountSettings.style';
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from '@ant-design/icons';

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
  const onSubmit = (data) => console.log(data);
  return (
    <Fragment>
      <FormTitle>Información Básica</FormTitle>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              label="Nombre"
              htmlFor="name"
              error={errors.name && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="name"
                defaultValue=""
                control={control}
                rules={{ required: true }}
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
              error={errors.lastName && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="lastName"
                defaultValue=""
                control={control}
                rules={{ required: true }}
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
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DatePicker
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
              label="Genero"
              htmlFor="gender"
              error={
                errors.gender && <span>¡Este campo es requerido!</span>
              }
            >
              <Controller
                name="gender"
                defaultValue=""
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
          <Col lg={12}>
            <FormControl
              label="Correo electrónico"
              htmlFor="email"
              error={
                errors.email && (
                  <>
                    {errors.email?.type === 'required' && (
                      <span>¡Este campo es requerido!</span>
                    )}
                    {errors.email?.type === 'pattern' && (
                      <span>Please enter a valid email address!</span>
                    )}
                  </>
                )
              }
            >
              <Controller
                name="email"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="email"
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
          </Col>
          <Col lg={24}>
            <FormControl
              label="Dirección de residencia"
              htmlFor="address"
              error={errors.address && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="address"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
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
                defaultValue=""
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <h2>
                    <Checkbox.Group value={value}>
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
              label="¿Eres tutor de una persona con capacidades diferenciadas?"
              htmlFor="isCaregiver"
              error={
                errors.gender && <span>¡Este campo es requerido!</span>
              }
            >
              <Controller
                name="isCaregiver"
                defaultValue=""
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
              error={errors.institution && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="institution"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
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
            >
              <Controller
                name="describeYourself"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.TextArea
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
                errors.socialInstagram && <span>¡Este campo es requerido!</span>
              }
            >
              <Controller
                name="socialInstagram"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InstagramOutlined style={{ fontSize: '24px' }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input onChange={onChange} onBlur={onBlur} value={value} placeholder='Instagram'/>
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
              htmlFor="socialInstagram"
              error={
                errors.socialInstagram && <span>¡Este campo es requerido!</span>
              }
            >
              <Controller
                name="socialInstagram"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FacebookOutlined style={{ fontSize: '24px' }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input onChange={onChange} onBlur={onBlur} value={value} placeholder='Facebook'/>
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
              htmlFor="socialInstagram"
              error={
                errors.socialInstagram && <span>¡Este campo es requerido!</span>
              }
            >
              <Controller
                name="socialInstagram"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
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
