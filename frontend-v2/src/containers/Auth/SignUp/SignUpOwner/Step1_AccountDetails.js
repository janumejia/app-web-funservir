import React, { useState } from 'react';
import { useStateMachine } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Button, Card, Tooltip, Alert } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction from './AddOwnerAction';
import { FormHeader, Title, Description, FormContent, FormAction } from './AddOwner.style';
import PasswordChecklist from "react-password-checklist"; // Sección donde se muestra que la contraseña ingresada cumple con lo requerido
import validator from "validator";
import axios from "../../../../settings/axiosConfig"; // Para la petición de registro

const emailVerification = async (email) => {
  try {
    await axios.post(`${process.env.REACT_APP_HOST_BACK}/uniqueEmailValidator`, { email: email });
    // No se hace nada aquí, solo cuando el correo está repetido se informa

  } catch (error) {
    if (typeof error.response.status !== 'undefined' && error.response.status === 409) return false; // Invalido

  }
  return true; // Válido
}

const AccountDetails = ({ setStep }) => {
  const { actions, state } = useStateMachine({ addDataAction }); // Usamos el estado global de StateMachine

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    trigger, // Lo importamos para validar que la entrada del usuario se cumpla mientras se está editando
  } = useForm({
    defaultValues: { // Valores por defecto del formularios
      name: state?.data2?.name,
      lastName: state?.data2?.lastName,
      email: state?.data2?.email,
      password: state?.data2?.password,
      confirmPassword: state?.data2?.confirmPassword,
    },
  });

  const [password, setPassword] = useState(typeof state?.data2?.password === 'undefined' ? "" : state.data2.password); // Lo usamos para comparar que las contraseñas ingresadas sean iguales (campos contraseña y confirmar contraseña)
  const [confirmPassword, setConfirmPassword] = useState(typeof state?.data2?.confirmPassword === 'undefined' ? "" : state.data2.confirmPassword); // Lo usamos para comparar que las contraseñas ingresadas sean iguales (campos contraseña y confirmar contraseña)

  const handleOnChange = (key, event) => {
    actions.addDataAction({ [key]: event.target.value });
    setValue(key, event.target.value);
  };

  const onSubmit = (data) => {
    actions.addDataAction(data); // Guardar la información ingresada en el estado de StateMachine
    setStep(2); // Pasar a la siguiente página de registro
    window.scrollTo(0, 0);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 1 de 5: Detalles de la cuenta</Title>
          <Description>
            Completa los datos de tu cuenta para iniciar sesión en la aplicación.
          </Description>
        </FormHeader>
        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Nombre"
              htmlFor="name"
              error={
                errors.name && errors.name.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.name && errors.name.type === "pattern" ? (
                  <span>¡El nombre está en un formato no válido!</span>
                ) : null
              }
            >
              <Controller
                name="name"
                defaultValue={state?.data2?.name}
                control={control}
                rules={{
                  required: true,
                  pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      handleOnChange('name', e);
                      trigger("name");
                    }}
                    onBlur={() => { // Cuando el usuario quita el focus del campo
                      trigger("name");
                      onBlur();
                    }}
                    value={value}
                    placeholder="Escribe tu nombre"
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Apellido"
              htmlFor="lastName"
              error={
                errors.lastName && errors.lastName.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.lastName && errors.lastName.type === "pattern" ? (
                  <span>¡El apellido está en un formato no válido!</span>
                ) : null
              }
            >
              <Controller
                name="lastName"
                defaultValue={state?.data2?.lastName}
                control={control}
                rules={{
                  required: true,
                  pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      handleOnChange('lastName', e);
                      trigger("lastName");
                    }}
                    onBlur={() => { // Cuando el usuario quita el focus del campo
                      trigger("lastName");
                      onBlur();
                    }}
                    value={value}
                    placeholder="Escribe tu apellido"
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>

        <FormControl
          label="Correo electrónico"
          htmlFor="email"
          error={
            errors.email && errors.email.type === "required" ? (
              <span>¡Este campo es requerido!{console.log(errors.email)}</span>
            ) : errors.email && errors.email.type === "isEmailValid" ? (
              <span> {errors.email.message} </span>
            ) : null
          }
        >
          <Controller
            name="email"
            defaultValue={state?.data2?.email}
            control={control}
            rules={{
              required: true,
              validate: {
                isEmailValid: async (value) => {
                  return validator.isEmail(value) ? (await emailVerification(value) ? true : "¡Este correo ya se encuentra registrado!") : "¡El correo está en un formato no válido!";
                }
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('email', e);
                  trigger("email");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("email");
                  onBlur();
                }}
                value={value}
                placeholder="Escribe tu correo"
                suffix={
                  <Tooltip placement="topRight" title='Asegurese que el correo ingresado esté correctamente escrito' >
                    <QuestionCircleOutlined style={{ color: 'gray', opacity: 0.5, fontSize: '18px' }} />
                  </Tooltip>
                }
              />
            )}
          />
        </FormControl>

        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Contraseña"
              htmlFor="password"
              error={
                errors.password && errors.password.type === "required" ? (
                  // <span>¡Este campo es requerido!</span>
                  <span />
                ) : errors.password && errors.password.type === "pattern" ? (
                  // <span>La contraseña debe tener al menos 8 caracteres e incluir obligatoriamente 1 letra mayúscula, 1 letra minúscula, 1 número y 1 carácter especial.</span>
                  <span>Haz ingresado un carácter no permitido</span>
                ) : errors.password && errors.password.type === "validate" ? (
                  // <span>La contraseña debe tener al menos 8 caracteres e incluir obligatoriamente 1 letra mayúscula, 1 letra minúscula, 1 número y 1 carácter especial.</span>
                  <span />
                ) : null
              }
            >
              <Controller
                name="password"
                defaultValue={state?.data2?.password}
                control={control}
                rules={{
                  required: true,
                  pattern: /^([a-zA-ZñÑáéíóúÁÉÍÓÚü0-9~`¿¡!#$%\^&*€£@+÷=\-\[\]\\';,/{}\(\)|\\":<>\?\.\_])*$/,
                  validate: (value) => validator.isStrongPassword(value)
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      setPassword(e.target.value); // Ajustamos el valor de la contraseña de nuestro useState, para posteriormente compara con la contraseña del campo confirmar contraseña
                      handleOnChange('password', e);
                      trigger("password");
                    }}
                    onBlur={() => { // Cuando el usuario quita el focus del campo
                      trigger("password");
                      onBlur();
                    }}
                    value={value}
                    placeholder="Escribe tu contraseña"
                  />
                )}
              />

            </FormControl>
            {/* Checklist donde se muestra que la contraseña ingresada cumple con lo requerido */}
            <Card>
              <PasswordChecklist
                rules={["minLength", "maxLength", "specialChar", "number", "capital", "lowercase"]}
                minLength={8}
                maxLength={70}
                value={password}
                messages={{
                  minLength: "Mínimo 8 caracteres.",
                  maxLength: "Máximo 70 caracteres.",
                  specialChar: "Un carácter especial.",
                  number: "Un número.",
                  capital: "Una letra mayúscula.",
                  lowercase: "Una letra minúscula.",
                }}
                validColor={"#008489"}
                invalidColor={"#eeeee4"}
              />
            </Card>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Confirmar contraseña"
              htmlFor="confirmPassword"
              error={
                errors.confirmPassword && errors.confirmPassword.type === "required" ? (
                  // <span>¡Este campo es requerido!</span>
                  <span />
                ) : errors.confirmPassword && errors.confirmPassword.type === "pattern" ? (
                  // <span>¡La contraseña está en un formato no válido!</span>
                  <span />
                ) : errors.confirmPassword && errors.confirmPassword.type === "validate" ? (
                  // <span>¡Las contraseñas no coincide!</span>
                  <span />
                ) : null
              }
            >
              <Controller
                name="confirmPassword"
                defaultValue={state?.data2?.confirmPassword}
                control={control}
                rules={{
                  required: true,
                  validate: (value) =>
                    value === password || false,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      handleOnChange('confirmPassword', e);
                      setConfirmPassword(e.target.value);
                      trigger("confirmPassword");
                    }}
                    onBlur={() => { // Cuando el usuario quita el focus del campo
                      trigger("confirmPassword");
                      onBlur();
                    }}
                    value={state?.data2?.confirmPassword}
                    placeholder="Escribe otra vez tu contraseña"
                  />
                )}
              />
            </FormControl>
            <Card>
              <PasswordChecklist
                rules={["match"]}
                value={password}
                valueAgain={confirmPassword}
                messages={{
                  match: "Las contraseñas coinciden.",
                }}
                validColor={"#008489"}
                invalidColor={"#eeeee4"}
              />
            </Card>
          </Col>
        </Row>
        <div style={{marginTop:'20px'}}>
          <Alert
            message="Atención"
            description="Antes de continuar, verifique que su correo electrónico esté escrito correctamente. Al finalizar se le enviará un email para completar el registro."
            type="warning"
            showIcon
            closable
          />
        </div>
      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button type="primary" htmlType="submit">
            Siguiente
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default AccountDetails;