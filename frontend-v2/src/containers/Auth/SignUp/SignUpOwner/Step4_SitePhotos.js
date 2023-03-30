import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import FormControl from 'components/UI/FormControl/FormControl';
import AddOwnerAction from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction } from './AddOwner.style';

const hotelPhotos = [
  {
    uid: '1',
    name: 'hotel-1.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '2',
    name: 'hotel-2.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '3',
    name: 'hotel-3.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

const HotelPhotos = ({ setStep }) => {
  const { actions, state } = useStateMachine({ AddOwnerAction });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: { hotelPhotos },
  });

  useEffect(() => {
    register('hotelPhotos', { required: true });
  }, [register]);

  const onSubmit = (data) => {
    actions.AddOwnerAction(data);
    setStep(5);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 4 de 5: Detalles de la cuenta</Title>
        </FormHeader>
        <FormControl
          error={errors.hotelPhotos && <span>This field is required!</span>}
        >
          <DragAndDropUploader
            name="hotelPhotos"
            value={state?.data?.hotelPhotos}
            onUploadChange={(data) => setValue('hotelPhotos', data)}
          />
        </FormControl>
      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button
            className="back-btn"
            htmlType="button"
            onClick={() => setStep(1)}
          >
            <IoIosArrowBack /> Back
          </Button>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default HotelPhotos;