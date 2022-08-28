import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Select, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import DatePicker from 'components/UI/AntdDatePicker/AntdDatePicker';
import RadioGroup from 'components/UI/RadioGroup/RadioGroup';
import { FormTitle } from './AccountSettings.style';

const genderOptions = [
  { label: 'Hombre', value: 'male' },
  { label: 'Mujer', value: 'female' },
  { label: 'Otro', value: 'Other' },
];
const disabilities = [
  { label: 'English', value: 'english' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'French', value: 'french' },
  { label: 'Russian', value: 'russian' },
];

const AgentCreateOrUpdateForm = ({dataUser}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <Fragment>
      {/* <FormTitle>Hola {dataUser.name}, falta poco para terminar tu registro</FormTitle> */}
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        {/* Parte de pedir el nombre y apellido */}
        {/* <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              label="First name"
              htmlFor="firstName"
              error={errors.firstName && <span>This field is required!</span>}
            >
              <Controller
                name="firstName"
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
              label="Last name"
              htmlFor="lastName"
              error={errors.lastName && <span>This field is required!</span>}
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
        </Row> */}
        <Row gutter={30}>
          <Col lg={12}>
            <FormControl
              label="Fecha de nacimiento"
              htmlFor="dateOfBirthday"
              error={
                errors.dateOfBirthday && <span>This field is required!</span>
              }
            >
              <Controller
                name="dateOfBirthday"
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
            <Row gutter={30}>
              <Col md={12}>
                <FormControl
                  label="Me identifico"
                  htmlFor="agentGender"
                  error={
                    errors.agentGender && <span>This field is required!</span>
                  }
                >
                  <Controller
                    name="agentGender"
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
              {/* <Col md={12}>
                <FormControl
                  label="Preferred Language"
                  htmlFor="preferredLanguage"
                  error={
                    errors.preferredLanguage && (
                      <span>This field is required!</span>
                    )
                  }
                >
                  <Controller
                    name="preferredLanguage"
                    defaultValue=""
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Select
                        options={languageOptions}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                </FormControl>
              </Col> */}
            </Row>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col lg={12}>
          <FormControl
              label="Dirección de residencia"
              htmlFor="address"
              error={errors.address && <span>This field is required!</span>}
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
          <Col lg={12}>
            <FormControl
              label="Número telefónico"
              htmlFor="phoneNumber"
              error={
                errors.phoneNumber && (
                  <>
                    {errors.phoneNumber?.type === 'required' && (
                      <span>This field is required!</span>
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
          {/* Discapacidades que tiene la persona */}
          <Col md={24}>
                <FormControl
                  label="Limitaciones"
                  htmlFor="preferredLanguage"
                  error={
                    errors.preferredLanguage && (
                      <span>This field is required!</span>
                    )
                  }
                >
                  <Controller
                    name="preferredLanguage"
                    defaultValue=""
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <RadioGroup
                        options={disabilities}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                </FormControl>
              </Col>
          <Col lg={24}>
            <FormControl
              label="Describete (Opcional)"
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
        <div className="submit-container">
          <Button htmlType="submit" type="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default AgentCreateOrUpdateForm;
