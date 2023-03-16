import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FORGET_PASSWORD_PAGE } from 'settings/constant';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';

// DESCRIPCIÓN:
// Componente del formulario (campos de correo y contraseña) que usa la componente de la página de inicio de sesión. 

export default function SignInForm() {
  
  // Extraemos signIn, loggedIn y admin del contexto de autenticación
  const { signIn, loggedIn, admin } = useContext(AuthContext);
  
  // Extraemos control, errors, y handleSubmit de useForm
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  
  // Función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    signIn(data);
    // console.log(admin);
  };
  
  // Si el usuario está loggeado y no es admin, redirigimos a la página principal
  if (loggedIn && !admin) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                <span>La contraseña debe no debe superar 50 caracteres</span>
              )}
            </>
          )
        }
      >
        <Controller
          name="password"
          defaultValue=""
          control={control}
          rules={{ required: true, minLength: 8, maxLength: 50 }}
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
        <Link to={FORGET_PASSWORD_PAGE}>¿Olvidaste tu contraseña?</Link>
      </FieldWrapper>
      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: '100%' }}
      >
        <MdLockOpen />
        Iniciar sesión
      </Button>
    </form>
  );
}
