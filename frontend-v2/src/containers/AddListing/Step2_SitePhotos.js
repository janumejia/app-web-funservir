import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { Button, message } from 'antd';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import AddListingAction from './AddListingAction';
import { FormHeader, Title, FormContent, FormAction } from './AddListing.style';

const SitePhotos = ({ setStep }) => {
  const { actions, state } = useStateMachine({ AddListingAction });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues:  state?.dataAddSite?.sitePhotos 
  });

  useEffect(() => {
    register('sitePhotos'); //'sitePhotos', { required: true }
  }, [register]);


  const onSubmit = (dataAddSite) => {
    if(!state.dataAddSite.sitePhotos || state.dataAddSite.sitePhotos.length === 0){
      message.error('¡Debes subir al menos 1 foto del sitio!');
    }else{
      setStep(3);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 2 de 3: Fotos del sitio</Title>
        </FormHeader>

          <DragAndDropUploader
            name="sitePhotos"
            value={state?.dataAddSite?.sitePhotos}
            onUploadChange={(dataAddSite) => {
              actions.AddListingAction({'sitePhotos': dataAddSite});
              setValue('sitePhotos', dataAddSite)
            }}
          />

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
            Siguiente
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default SitePhotos;
