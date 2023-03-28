import React, { useState } from 'react';
import { StateMachineProvider, createStore } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { Progress } from 'antd';

// Importamos cada paso del registro
import Step1_AccountDetails from './Step1_AccountDetails'; // Paso 1
import Step2_BasicInformation from './Step2_BasicInformation'; // Paso 2

import Stepper from './AddUser.style';

// Descripción:
// Componente de registro de usuario, donde controlamos los pasos de registro que debe completar el que va el usuario
// y desplegamos la respectiva pantalla de acuerdo al paso en el que se encuentra (solo son 2 pasos)
const AddUser = () => {
  let stepComponent; // Para ajustar el paso del registro en el que va el usuario
  const [step, setStep] = useState(1); // Paso = Pantalla de registro
  switch (step) {
    case 1:
      stepComponent = <Step1_AccountDetails setStep={setStep} />;
      break;
      
    case 2:
      stepComponent = <Step2_BasicInformation setStep={setStep} />;
      break;

    default:
      stepComponent = null;
  }

  return (
    <StateMachineProvider> {/* Se usa para recordar la información ingresada por el usuario entre pasos */}
      <Stepper>
        <Progress // Esta es la barra de progreso de antd
          className="stepper-progress"
          percent={step * 50}
          showInfo={false}
        />
        {stepComponent}
      </Stepper>
    </StateMachineProvider>
  );
};

export default AddUser;
