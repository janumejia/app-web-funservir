import React, { useState, useEffect } from 'react';
import { StateMachineProvider, createStore } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { Progress, message } from 'antd';
import axios from '../../settings/axiosConfig.js';

// Importamos cada paso del registro
import Step1_KeyPointInformation from './Step1_KeyPointInformation.js'; // Paso 1

import Stepper from './AddCreateKeyPoint.style.js';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from 'components/Loader/Loader.js';

createStore({}); // Siempre hay que crearlo para que pueda leer el estado guardado en la sessionStorage

// Descripción:
// Componente de registro de usuario, donde controlamos los pasos de registro que debe completar el que va el usuario
// y desplegamos la respectiva pantalla de acuerdo al paso en el que se encuentra (solo son 2 pasos)
const CreateKeyPoint = () => {
  let navigate = useNavigate();
  // const location = useLocation();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);
  // Para ajustar las opciones disponibles
  // const [availableLocalities, setAvailableLocalities] = useState([]);
  // const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
  // const [availableCategories, setAvailableCategories] = useState([]);
  // console.log("location: ", location)
  console.log("slug: ", slug)
  // Se ejecuta cada vez que se modifica el valor de count
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST_BACK}/getSingleKeyPoint/${slug}`)
      .then((res) => {
        // setAvailableElements(res.data);
        console.log("found data: ", res.data[0])
        if(res.data[0]) {
          setInitialData(res.data[0]);
          setLoading(false);
        } else {
          navigate('/404', { replace: true })
        }
      }).catch((error) => {

        navigate('/404', { replace: true })
        // message.info({ content: blankMessage, duration: 5 });
        // message.error('No se pudieron cargar los elementos inclusivos disponibles', 5);
        // console.error(error)
      });


    // axios.get(`${process.env.REACT_APP_HOST_BACK}/getLocations`)
    //   .then((res) => {
    //     setAvailableLocalities(res.data);
    //   }).catch((error) => {
    //     // message.info({ content: blankMessage, duration: 5 });
    //     // message.error('No se pudieron cargar las localidades disponibles', 5);
    //     // console.error(error);
    //   });


    // axios.get(`${process.env.REACT_APP_HOST_BACK}/getNeighborhoods`)
    //   .then((res) => {
    //     setAvailableNeighborhoods(res.data);
    //   }).catch((error) => {
    //     // message.info({ content: blankMessage, duration: 5 });
    //     // message.error('No se pudieron cargar los barrios disponibles', 5);
    //     // console.error(error)
    //   });

    // axios.get(`${process.env.REACT_APP_HOST_BACK}/getCategories`)
    //   .then((res) => {
    //     setAvailableCategories(res.data);
    //   }).catch((error) => {
    //     // message.info({ content: blankMessage, duration: 5 });
    //     // message.error('No se pudieron cargar las categorías disponibles', 5);
    //     // console.error(error)
    //   });

  }, []);

  let stepComponent; // Para ajustar el paso del registro en el que va el usuario

  const [step, setStep] = useState(1); // Paso = Pantalla de registro

  switch (step) {
    case 1:
      stepComponent = <Step1_KeyPointInformation setStep={setStep} initialData={initialData} />;
      break;

    // case 2:
    //   stepComponent = <Step2_SitePhotos setStep={setStep} />;
    //   break;

    // case 3:
    //   stepComponent = <Step3_MoreInfoSite setStep={setStep} availableLocalities={availableLocalities} availableNeighborhoods={availableNeighborhoods} />;
    //   break;

    default:
      stepComponent = null;
  }

  if (loading) return <Loader />

  return (
    <StateMachineProvider> {/* Se usa para recordar la información ingresada por el usuario entre pasos */}
      <Stepper>
        {/* <Progress // Esta es la barra de progreso de antd
          className="stepper-progress"
          percent={step * 100}
          showInfo={false}
        /> */}
        {stepComponent}
      </Stepper>
    </StateMachineProvider>
  );
};

export default CreateKeyPoint;