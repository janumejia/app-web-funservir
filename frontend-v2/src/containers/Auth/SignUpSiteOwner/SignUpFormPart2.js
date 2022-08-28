import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';

const SignUpForm = () => {
  const { signUp, loggedIn } = useContext(AuthContext);
  const {
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const onSubmit = (data) => {
    signUp(data);
  };
  if (loggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        label="Nombre completo"
        htmlFor="name"
        error={
          errors.name && (
            <>
              {errors.name?.type === 'required' && (
                <span>¡Este campo es requerido!</span>
              )}
            </>
          )
        }
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
                <span>El formato de correo no es válido</span>
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
      <FormControl
        label="Contraseña"
        htmlFor="password"
        error={
          errors.password && (
            <>
              {errors.password?.type === 'required' && (
                <span>¡Este campo es requerido!</span>
              )}
              {errors.password?.type === 'minLength' && (
                <span>La contraseña debe tener mínimo 8 caracteres</span>
              )}
              {errors.password?.type === 'maxLength' && (
                <span>La contraseña debe no debe superar 20 caracteres</span>
              )}
            </>
          )
        }
      >
        <Controller
          name="password"
          defaultValue=""
          control={control}
          rules={{ required: true, minLength: 8, maxLength: 20 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input.Password onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
      </FormControl>
      <FormControl
        label="Confirmar contraseña"
        htmlFor="confirmPassword"
        error={
          confirmPassword &&
          password !== confirmPassword && (
            <span>Las contraseñas no coinciden</span>
          )
        }
      >
        <Controller
          name="confirmPassword"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input.Password onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
      </FormControl>
      <FieldWrapper>
        <SwitchWrapper>
          <Controller
            control={control}
            name="rememberMe"
            valueName="checked"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Switch onChange={onChange} checked={value} />
            )}
          />
          <Label>Recordarme</Label>
        </SwitchWrapper>
        <SwitchWrapper>
          <Controller
            control={control}
            name="termsAndConditions"
            valueName="checked"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Switch onChange={onChange} checked={value} />
            )}
          />
          <Label>Acepto los términos y condiciones</Label>
        </SwitchWrapper>
      </FieldWrapper>
      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: '100%' }}
      >
        <MdLockOpen />
        Registrarme
      </Button>
    </form>
  );
};

export default SignUpForm;
