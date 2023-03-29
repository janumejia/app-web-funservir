import React, { useEffect, useState } from 'react';
import { useStateMachine } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, InputNumber, Button } from 'antd';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction from './AddUserAction';
import { FormHeader, Title, Description, FormContent, FormAction } from './AddUser.style';
import PasswordChecklist from "react-password-checklist"; // Sección donde se muestra que la contraseña ingresada cumple con lo requerido

const AccountDetails = ({ setStep }) => {
  const { actions, state } = useStateMachine({ addDataAction }); // Usamos el estado global de StateMachine

  const {
    control,
    formState: { errors },
    handleSubmit,
    trigger, // Lo importamos para validar que la entrada del usuario se cumpla mientras se está editando
  } = useForm({
    defaultValues: { // Valores por defecto del formularios
      name: state?.data?.name,
      lastName: state?.data?.lastName,
      email: state?.data?.email,
      password: state?.data?.password,
      confirmPassword: state?.data?.confirmPassword,
    },
  });

  const [password, setPassword] = useState(typeof state?.data?.password === 'undefined' ? "" : state.data.password); // Lo usamos para comparar que las contraseñas ingresadas sean iguales (campos contraseña y confirmar contraseña)
  const [confirmPassword, setConfirmPassword] = useState(typeof state?.data?.confirmPassword === 'undefined' ? "" : state.data.confirmPassword); // Lo usamos para comparar que las contraseñas ingresadas sean iguales (campos contraseña y confirmar contraseña)

  const onSubmit = (data) => {
    actions.addDataAction(data); // Guardar la información ingresada en el estado de StateMachine
    setStep(2); // Pasar a la siguiente página de registro
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 1 de 2: Detalles de la cuenta</Title>
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
                defaultValue={state?.data?.name}
                control={control}
                rules={{
                  required: true,
                  pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
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
                defaultValue={state?.data?.lastName}
                control={control}
                rules={{
                  required: true,
                  pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
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
              <span>¡Este campo es requerido!</span>
            ) : errors.email && errors.email.type === "pattern" ? (
              <span>¡El correo está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="email"
            defaultValue={state?.data?.email}
            control={control}
            rules={{
              required: true,
              pattern: /^\w+([.-]?\w+){1,150}@\w+([.-]?\w+){1,147}(\.\w{2,3})+$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  trigger("email");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("email");
                  onBlur();
                }}
                value={value}
                placeholder="Escribe tu correo"
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
                  <span>¡Este campo es requerido!</span>
                ) : errors.password && errors.password.type === "pattern" ? (
                  // <span>La contraseña debe tener al menos 8 caracteres e incluir obligatoriamente 1 letra mayúscula, 1 letra minúscula, 1 número y 1 carácter especial.</span>
                  <span />
                ) : null
              }
            >
              <Controller
                name="password"
                defaultValue={state?.data?.password}
                control={control}
                rules={{
                  required: true,
                  pattern: /^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/, // // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      setPassword(e.target.value); // Ajustamos el valor de la contraseña de nuestro useState, para posteriormente compara con la contraseña del campo confirmar contraseña
                      trigger("password");
                    }}
                    onBlur={() => { // Cuando el usuario quita el focus del campo
                      trigger("password");
                      onBlur();
                    }}
                    value={value}
                    placeholder="Escribe tu contraseña"

                    // Para evitar copy paste de la contraseña
                    // onPaste={(e) => {
                    //   e.preventDefault()
                    //   return false;
                    // }}
                    // onCopy={(e) => {
                    //   e.preventDefault()
                    //   return false;
                    // }}
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Confirmar contraseña"
              htmlFor="confirmPassword"
              error={
                errors.confirmPassword && errors.confirmPassword.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
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
                defaultValue={state?.data?.confirmPassword}
                control={control}
                rules={{
                  required: true,
                  // pattern:  /^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/, // // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                  validate: (value) =>
                    value === password || false,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      setConfirmPassword(e.target.value);
                      trigger("confirmPassword");
                    }}
                    onBlur={() => { // Cuando el usuario quita el focus del campo
                      trigger("confirmPassword");
                      onBlur();
                    }}
                    value={value}
                    placeholder="Escribe otra vez tu contraseña"

                    // Para evitar copy paste de la contraseña
                    // onPaste={(e) => {
                    //   e.preventDefault()
                    //   return false;
                    // }}
                    // onCopy={(e) => {
                    //   e.preventDefault()
                    //   return false;
                    // }}

                  />
                )}
              />


            </FormControl>
          </Col>
        </Row>

        {/* Checklist donde se muestra que la contraseña ingresada cumple con lo requerido */}
        <PasswordChecklist
          rules={["minLength", "maxLength", "specialChar", "number", "capital", "lowercase", "match"]}
          minLength={8}
          maxLength={70}
          value={password}
          valueAgain={confirmPassword}
          messages={{
            minLength: "La contraseña tiene más de 8 caracteres.",
            maxLength: "La contraseña tiene menos de 70 caracteres.",
            specialChar: "La contraseña tiene caracteres especiales.",
            number: "La contraseña tiene un número.",
            capital: "La contraseña tiene una letra mayúscula.",
            lowercase: "La contraseña tiene una letra minúscula.",
            match: "Las contraseñas coinciden.",
          }}
        />
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
