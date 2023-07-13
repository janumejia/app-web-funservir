import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { Button, message } from 'antd';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import EditDataAction from './EditListingAction';
import { FormHeader, Title, FormContent, FormAction } from './EditListing.style';

const SitePhotos = ({ setStep }) => {
  const { actions, state } = useStateMachine({ EditDataAction });
  const {
    register,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: state?.dataEditSite?.sitePhotos 
  });

  useEffect(() => {
    register('sitePhotos'); //'sitePhotos', { required: true }
  }, [register]);


  const onSubmit = (dataEditSite) => {
    if(!state.dataEditSite.sitePhotos || state.dataEditSite.sitePhotos.length === 0){
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
            value={state?.dataEditSite?.sitePhotos}
            onUploadChange={(dataEditSite) => {
              actions.EditDataAction({'sitePhotos': dataEditSite});
              setValue('sitePhotos', dataEditSite)
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
