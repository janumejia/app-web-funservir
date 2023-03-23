import React, { useEffect } from 'react';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, InputNumber, Button } from 'antd';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import FormControl from 'components/UI/FormControl/FormControl';
import addListingAction from './AddUserAction';
import { FormHeader, Title, FormContent, FormAction } from './AddUser.style';

const AccountDetails = ({ setStep }) => {
  const { actions, state } = useStateMachine({ addListingAction });
  const {
    control,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: state?.data?.name,
      lastName: state?.data?.lastName,
      hotelDescription: state?.data?.hotelDescription,
      guest: state?.data?.guest || 0,
      bed: state?.data?.bed || 0,
    },
  });

  useEffect(() => {
    register('guest', { required: true });
    register('bed', { required: true });
  }, [register]);

  const handleOnChange = (key, event) => {
    actions.addListingAction({ [key]: event.target.value });
    setValue(key, event.target.value);
  };

  const handleIncrement = (key) => {
    const incrementValue = ++state.data[key];
    actions.addListingAction({ [key]: incrementValue });
    setValue(key, incrementValue);
  };

  const handleDecrement = (key) => {
    if (state.data[key] < 1) {
      return false;
    }
    const decrementValue = --state.data[key];
    actions.addListingAction({ [key]: decrementValue });
    setValue(key, decrementValue);
  };

  const onSubmit = (data) => {
    actions.addListingAction(data);
    setStep(2);
  };

  console.log('data', state);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 1: Detalles de la cuenta</Title>
        </FormHeader>
        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Nombre"
              htmlFor="name"
              error={errors.name && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="name"
                defaultValue={state?.data?.name}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
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
              error={errors.lastName && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="lastName"
                defaultValue={state?.data?.lastName}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
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
          error={errors.email && <span>¡Este campo es requerido!</span>}
        >
          <Controller
            name="email"
            defaultValue={state?.data?.email}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={onChange}
                onBlur={onBlur}
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
              error={errors.name && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="password"
                defaultValue={state?.data?.password}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Escribe tu contraseña"
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Confirmar contraseña"
              htmlFor="confirmPassword"
              error={errors.lastName && <span>¡Este campo es requerido!</span>}
            >
              <Controller
                name="confirmPassword"
                defaultValue={state?.data?.confirmPassword}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Escribe tu contraseña"
                  />
                )}
              />
            </FormControl>
          </Col>
        </Row>
      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default AccountDetails;
