import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import FormControl from 'components/UI/FormControl/FormControl';
import AddOwnerAction from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction } from './AddOwner.style';

<<<<<<< HEAD
const SitePhotos = ({ setStep }) => {
=======



// const handleChange = (info) => {

//   const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
//   if (!isJpgOrPng) {
//     message.error('¡Solo puedes subir imagenes!');
//   } else {
//     getBase64(info.file);
//   }

//   /*const isLt2M = info.file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//       message.error('La imagen debe ser menor a 2MB!');
//   }*/
// };

const HotelPhotos = ({ setStep }) => {
>>>>>>> 5115f32 (cambios obligados)
  const { actions, state } = useStateMachine({ AddOwnerAction });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
<<<<<<< HEAD
    defaultValues:  state?.data2?.sitePhotos 
=======
    defaultValues: state?.data,
>>>>>>> 5115f32 (cambios obligados)
  });

  useEffect(() => {
    register('sitePhotos'); //'sitePhotos', { required: true }
  }, [register]);

  console.log(state);
  const onSubmit = (data2) => {
    setStep(5);
  };
  
<<<<<<< HEAD

  // const getBase64 = (img) => {
  //   let base64Universal = [...state?.data2?.sitePhotos]
  //   const reader = new FileReader();
  //   if (img) {
  //     reader.readAsDataURL(img);
  //     reader.onloadend = () => {
  //       actions.AddOwnerAction({ sitePhotos: reader.result });
  //     }
  //   }
  // };
=======
>>>>>>> fc852d1 (falta convertir a base64 y mandar al back)

  // const getBase64 = (img) => {
  //   let base64Universal = [...state?.data2?.sitePhotos]
  //   const reader = new FileReader();
  //   if (img) {
  //     reader.readAsDataURL(img);
  //     reader.onloadend = () => {
  //       actions.AddOwnerAction({ sitePhotos: reader.result });
  //     }
  //   }
  // };

  const getBase64 = (img) => {
    const reader = new FileReader();
    if (img) {
      reader.readAsDataURL(img);
      reader.onloadend = () => {
        actions.AddOwnerAction({ hotelPhotos: reader.result });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 4 de 5: Fotos del sitio</Title>
        </FormHeader>
<<<<<<< HEAD

          <DragAndDropUploader
<<<<<<< HEAD
            name="sitePhotos"
            value={state?.data2?.sitePhotos}
            onUploadChange={(data2) => {
              actions.AddOwnerAction({'sitePhotos': data2});
              setValue('sitePhotos', data2)
=======
            name="hotelPhotos"
            value={state?.data2?.hotelPhotos}
            onUploadChange={(data2) => {
              setValue('hotelPhotos', data2)

>>>>>>> 8f52dc9 (commit para poder actualizar desde main)
=======

          <DragAndDropUploader
            name="sitePhotos"
            value={state?.data2?.sitePhotos}
            onUploadChange={(data2) => {
              actions.AddOwnerAction({'sitePhotos': data2});
              setValue('sitePhotos', data2)
>>>>>>> fc852d1 (falta convertir a base64 y mandar al back)
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
