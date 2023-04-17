import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Radio, Button, Input, DatePicker, Checkbox, message } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction, { addDataResetAction } from './AddUserAction';
import {
  FormHeader,
  Title,
  Description,
  FormContent,
  FormAction,
} from './AddUser.style';
import axios from "../../../../settings/axiosConfig"; // Para la petición de registro
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const BasicInformationU = ({ setStep }) => {

  const { actions: actionsUpdate, state } = useStateMachine({ addDataAction });
  const { actions: actionsReset } = useStateMachine({ addDataResetAction });

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    trigger, // Lo importamos para validar que la entrada del usuario se cumpla mientras se está editando
  } = useForm({
    defaultValues: { // Valores por defecto del formularios
      dateOfBirth: state?.data?.dateOfBirth,
      gender: state?.data?.gender,
      address: state?.data?.address,
      condition: state?.data?.condition,
      isCaregiver: state?.data?.isCaregiver,
      institution: state?.data?.institution,
    },
  });


  const handleOnChange = (key, event) => {
    actionsUpdate.addDataAction({ [key]: (key === 'condition' || key === 'dateOfBirth' ? event : event.target.value) });
    setValue(key, (key === 'condition' || key === 'dateOfBirth' ? event : event.target.value));
  };

  // const [formData, setFormData] = useState({}); // Para poder almacenar los valores del formulario cuando se da click en volver
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = { ...state.data, ...data };

    try {
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/registerUser`, formData);
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 5);
          // setTimeout(function () {
          actionsReset.addDataResetAction(); // Para resetear los campos una vez termine el registro
          navigate('/sign-in', { replace: true }); // El {replace: true} es para que la página anterior sea igual a la actual: https://reach.tech/router/api/navigate
          // }, 3000);
        } else message.warning(res.status + " - Respuesta del servidor desconocida");
      }
    } catch (error) {

      if (typeof error.response.status === 'undefined') {
        message.warning({ content: "Error de conectividad con el servidor", duration: 5 });
      } else {
        if (error.response.status >= 400 && error.response.status <= 499) { // Errores del cliente
          message.warning({ content: error.response.data.message, duration: 5 });
        }
        else if (error.response.status >= 500 && error.response.status <= 599) {
          message.error({ content: error.response.data.message, duration: 5 });
        } // Errores del servidor
        else {
          message.warning({ content: error.response.status + " - Error de conectividad con el servidor", duration: 5 });
        }
      }
    }

    // actions.addDataResetAction(); // Para resetear los campos una vez termine el registro
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>
            Paso 2 de 2: Información básica del usuario
          </Title>
          <Description>
            Completa los últimos campos sobre tu información personal para finalizar tu registro.
          </Description>
        </FormHeader>

        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Fecha de nacimiento"
              htmlFor="dateOfBirth"
              error={
                errors.dateOfBirth && errors.dateOfBirth.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.dateOfBirth && errors.dateOfBirth.type === "pattern" ? (
                  <span>¡La fecha está en un formato no válido!</span>
                ) : null
              }
            >
              <Controller
                name="dateOfBirth"
                defaultValue={state?.data?.dateOfBirth}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DatePicker
                    value={(state.data.dateOfBirth) ? moment(state.data.dateOfBirth) : ""}
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      if(e._d) handleOnChange('dateOfBirth', e._d);
                    }}
                    placeholder="Selecciona tu fecha de nacimiento"
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
        </Row>

        <FormControl
          label="Género"
          labelTag="h3"
          error={
            errors.gender && errors.gender.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.gender && errors.gender.type === "pattern" ? (
              <span>¡La fecha está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="gender"
            defaultValue={
              state?.data?.gender !== undefined
                ? state.data.gender
                : ''
            }
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Radio.Group
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('gender', e);
                }}
                onBlur={onBlur}
                value={value}
                options={
                  [
                    { label: 'Masculino', value: 'Masculino' },
                    { label: 'Femenino', value: 'Femenino' },
                    { label: 'Otro', value: 'Otro' },
                  ]
                }
              />
            )}
          />
        </FormControl>

        <FormControl
          label="Dirección de residencia"
          htmlFor="address"
          error={
            errors.address && errors.address.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.address && errors.address.type === "pattern" ? (
              <span>¡La dirección está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="address"
            defaultValue={state?.data?.address}
            control={control}
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚü\s.,-/#-]{5,255}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('address', e);
                  trigger("address");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("address");
                  onBlur();
                }}
                value={(value && value.trim() === "")?"":value}
                placeholder="Escribe tu dirección."
              />
            )}
          />
        </FormControl>


        <FormControl
          label="¿Tienes alguna limitación física o cognitiva? (Selecciona una o varias si es tu caso)"
          labelTag="h3"
        >
          <Controller
            name="condition"
            defaultValue={
              state?.data?.condition !== undefined
                ? state.data.condition
                : []
            }
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Checkbox.Group
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('condition', e);
                }}
                value={value}>
                <Checkbox value="Motriz">Motriz</Checkbox>
                <Checkbox value="Visual">Visual</Checkbox>
                <Checkbox value="Auditiva">Auditiva</Checkbox>
                <Checkbox value="Sensorial">Sensorial</Checkbox>
                <Checkbox value="Comunicación">Comunicación</Checkbox>
                <Checkbox value="Mental">Mental</Checkbox>
                <Checkbox value="Multiples">Múltiples</Checkbox>
                <Checkbox value="Otra">Otra</Checkbox>
              </Checkbox.Group>
            )}
          />
        </FormControl>

        <FormControl
          label="¿Eres tutor de apoyo de alguna persona con capacidades diferenciadas?"
          labelTag="h3"
          error={
            errors.isCaregiver && errors.isCaregiver.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.isCaregiver && errors.isCaregiver.type === "pattern" ? (
              <span>¡La fecha está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="isCaregiver"
            defaultValue={
              state?.data?.isCaregiver !== undefined
                ? state.data.isCaregiver
                : ''
            }
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Radio.Group
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('isCaregiver', e);
                }}
                onBlur={onBlur}
                value={value}
                options={
                  [
                    { label: 'Sí', value: 'Si' },
                    { label: 'No', value: 'No' },
                  ]
                }
              />
            )}
          />
        </FormControl>

        <FormControl
          label="¿Perteneces a alguna fundación? (Opcional)"
          htmlFor="institution"
          error={
            errors.institution && errors.institution.type === "pattern" ? (
              <span>¡El texto ingresado está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="institution"
            defaultValue={typeof state.data.institution === 'undefined' ? "" : state.data.institution}
            control={control}
            rules={{
              required: false,
              pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){0,255}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('institution', e);
                  trigger("institution");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("institution");
                  onBlur();
                }}
                value={(value && value.trim() === "")?"":value}
                placeholder="Escribe el nombre de la fundación."
              />
            )}
          />
        </FormControl>


      </FormContent>

      <FormAction>
        <div className="inner-wrapper">
          <Button
            className="back-btn"
            htmlType="button"
            onClick={() => {
              // actions.addDataAction(formData); // Falta implementar esto
              setStep(1)
            }}
          >
            <IoIosArrowBack /> Volver
          </Button>
          <Button type="primary" htmlType="submit">
            Terminar registro
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default BasicInformationU;