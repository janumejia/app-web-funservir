import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Row, Col, Card, message } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { FormTitle } from './AccountSettings.style';
import PasswordChecklist from "react-password-checklist"; // Sección donde se muestra que la contraseña ingresada cumple con lo requerido
import validator from "validator";
import axios from "../../../settings/axiosConfig"; // Para la petición de registro

export default function ChangePassWord() {
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (data) => {

    try {
      const modifiedData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }

      message.loading("Cargando", 0);
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/changePassword`, modifiedData);
      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 3);

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

  }

  return (
    <>
      <FormTitle>Cambiar contraseña</FormTitle>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={30}>
          <Col lg={24}>
            <FormControl
              label="Ingresa la contraseña actual"
              htmlFor="oldPassword"
              error={errors.oldPassword && <span>¡Este campo es obligatorio!</span>}
            >
              <Controller
                name="oldPassword"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
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
              label="Ingresa la nueva contraseña"
              htmlFor="newPassword"
              error={
                errors.newPassword && errors.newPassword.type === "required" ? (
                  // <span>¡Este campo es requerido!</span>
                  <span />
                ) : errors.newPassword && errors.newPassword.type === "validate" ? (
                  // <span>La contraseña debe tener al menos 8 caracteres e incluir obligatoriamente 1 letra mayúscula, 1 letra minúscula, 1 número y 1 carácter especial.</span>
                  <span />
                ) : null
              }
            >
              <Controller
                name="newPassword"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                  // pattern: /^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/, // // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                  validate: (value) => validator.isStrongPassword(value)
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>

                    <Input.Password
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                    <Card>
                      <PasswordChecklist
                        rules={["minLength", "maxLength", "specialChar", "number", "capital", "lowercase"]}
                        minLength={8}
                        maxLength={70}
                        value={value}
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
                  </>
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12}>
            <FormControl
              label="Confirmar nueva contraseña"
              htmlFor="confirmPassword"
              error={
                errors.confirmPassword && errors.confirmPassword.type === "required" ? (
                  <span />
                ) : errors.confirmPassword && errors.confirmPassword.type === "validate" ? (
                  <span />
                ) : null
              }
            >
              <Controller
                name="confirmPassword"
                defaultValue=""
                control={control}
                rules={{
                  required: true,
                  // pattern: /^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/, // // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                  validate: (value) => newPassword && value === newPassword
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input.Password
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                    <Card>
                      <PasswordChecklist
                        rules={["match"]}
                        value={newPassword ? newPassword : ""}
                        valueAgain={value}
                        messages={{
                          match: "Las contraseñas coinciden.",
                        }}
                        validColor={"#008489"}
                        invalidColor={"#eeeee4"}
                      />
                    </Card>
                  </>
                )}
              />
            </FormControl>
          </Col>
          <Col lg={24}>
            <div className="submit-container">
              <Button htmlType="submit" type="primary">
                Guardar cambios
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </>
  );
}
