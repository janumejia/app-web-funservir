import React, { useState } from 'react';
import { StateMachineProvider, createStore } from 'little-state-machine';
import { Progress } from 'antd';

import AccountDetails from './AccountDetails';
import BasicInformationU from './BasicInformationU';

import Stepper from './AddUser.style';

createStore({
  data: {
    guest: 0,
    bed: 0,
  },
});

const AddUser = () => {
  let stepComponent;
  const [step, setStep] = useState(1);
  switch (step) {
    case 1:
      stepComponent = <AccountDetails setStep={setStep} />;
      break;
      
    case 2:
      stepComponent = <BasicInformationU setStep={setStep} />;
      break;

    default:
      stepComponent = null;
  }

  return (
    <StateMachineProvider>
      <Stepper>
        <Progress
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
