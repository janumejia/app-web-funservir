import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { Button, message } from 'antd';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import AddOwnerAction from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction, Description } from './AddOwner.style';

const SitePhotos = ({ setStep }) => {
  const { actions, state } = useStateMachine({ AddOwnerAction });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: state?.data2?.sitePhotos
  });

  useEffect(() => {
    register('sitePhotos'); //'sitePhotos', { required: true }
    actions.AddOwnerAction({ 'sitePhotos': [] });
  }, [register]);


  const onSubmit = () => {
    if (!state.data2.sitePhotos || state.data2.sitePhotos.length === 0) {
      message.error('¡Debes subir al menos 1 foto del sitio!');
    } else {
      setStep(5);
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 4 de 5: Fotos del sitio</Title>
          <Description>
            Sube imágenes del sitio que muestren claramente los elementos inclusivos disponibles en este lugar.
          </Description>
        </FormHeader>

        <DragAndDropUploader
          name="sitePhotos"
          //value={state?.data2?.sitePhotos}
          onUploadChange={(data2) => {
            sleep(500).then(() => {
              actions.AddOwnerAction({ 'sitePhotos': data2 });
              setValue('sitePhotos', data2)
            })
          }
          }
        />

      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button
            className="back-btn"
            htmlType="button"
            onClick={() => setStep(3)}
          >
            <IoIosArrowBack /> Volver
          </Button>
          <Button type="primary" htmlType="submit">
            Siguiente
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default SitePhotos;
