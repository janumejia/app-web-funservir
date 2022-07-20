import React from 'react';
import LoginForm from './styles.module.css'
import TextField from '../../../components/commons/inputs/inputForm'
import RedButton from '../../../components/commons/buttons/redButton';

const FormularioB = () => {
  return(
    <div className={LoginForm.Container}>
        <div className={LoginForm.FormContainer}>
          <h2>Iniciar Sesión</h2>
          <form action=''>
          <TextField placeholder={'Correo'}/>
          <TextField placeholder={'Contraseña'}/>
          <a href="/" className={LoginForm.ForgotPswd}>{'¿Olvidaste tu contraseña?'}</a>
          <RedButton value={'Inicia Sesión'} />
          <div>
          <input type="checkbox" className={LoginForm.checkmark}/>Recordarme
          </div>
          <hr/>
          <a href="/" className={LoginForm.Member}>{'¿Aún no eres miembro?'}</a>
          </form>
        </div>
    </div>
  )  
};

export default FormularioB;