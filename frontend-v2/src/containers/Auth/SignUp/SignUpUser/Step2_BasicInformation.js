import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Radio, Button, Input, DatePicker } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction, { addDataResetAction } from './AddUserAction';
import {
  FormHeader,
  Title,
  Description,
  FormContent,
  FormAction,
} from './AddUser.style';

// import locale from 'antd/lib/locale-provider/es_ES';


const BasicInformationU = ({ setStep }) => {
  const {
    control,
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

  const { state } = useStateMachine({ addDataAction });
  const { actions } = useStateMachine({ addDataResetAction });

  const onSubmit = (data) => {
    const formData = { ...state.data, ...data };
    console.log('add hotel data: ', formData);
    alert(JSON.stringify(formData, null, 2));
    actions.addDataResetAction();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>
            Paso 2: Información básica del usuario
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
                    onChange={onChange}
                    placeholder="Selecciona una fecha"
                  // locale="es_ES" // set the locale to Spanish. No sirve :/
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>

        <FormControl
        label="Genero"
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
                onChange={onChange}
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
              pattern: /^[a-zA-Z0-9 #,.-]{5,255}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  trigger("address");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("address");
                  onBlur();
                }}
                value={value}
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
                : ''
            }
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Radio.Group
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={
                  [
                    { label: 'Motora', value: 'Motora' },
                    { label: 'Visual', value: 'Visual' },
                    { label: 'Auditiva', value: 'Auditiva' },
                    { label: 'Intelectual', value: 'Intelectual' },
                    { label: 'Psicosocial', value: 'Psicosocial' },
                  ]
                }
                mode="tags"
              />
            )}
          />
        </FormControl>

        <FormControl
          label="¿Eres tutor de apoyar de alguna persona con capacidades diferenciadas?"
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
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={
                  [
                    { label: 'Si', value: 'Si' },
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
            defaultValue={state?.data?.institution}
            control={control}
            rules={{
              required: false,
              pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){0,255}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  trigger("institution");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("institution");
                  onBlur();
                }}
                value={value}
                placeholder="Escribe tu dirección."
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
            onClick={() => setStep(1)}
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