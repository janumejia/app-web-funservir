import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import FormControl from 'components/UI/FormControl/FormControl';
import AddOwnerAction from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction } from './AddOwner.style';

const SitePhotos = ({ setStep }) => {
  const { actions, state } = useStateMachine({ AddOwnerAction });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues:  state?.data2?.sitePhotos 
  });

  useEffect(() => {
    register('sitePhotos'); //'sitePhotos', { required: true }
  }, [register]);


  const onSubmit = (data2) => {
    setStep(5);
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 4 de 5: Fotos del sitio</Title>
        </FormHeader>

          <DragAndDropUploader
            name="sitePhotos"
            value={state?.data2?.sitePhotos}
            onUploadChange={(data2) => {
              actions.AddOwnerAction({'sitePhotos': data2});
              setValue('sitePhotos', data2)
            }}
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
