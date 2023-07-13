import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Rate, Checkbox, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import RadioGroup from 'components/UI/RadioGroup/RadioGroup';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import { Form, Label, GroupTitle, Description } from './Review.style';

const reviewPhotos = [
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

export default function ReviewForm() {
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      reviewPhotos,
    },
  });
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        label="Calificación general"
        htmlFor="ratings"
        error={errors.ratings && <span>¡Este campo es requerido!</span>}
      >
        <Controller
          name="ratings"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Rate onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
      </FormControl>
      <FormControl
        label="Titulo de la opinión"
        htmlFor="reviewTitle"
        error={errors.reviewTitle && <span>¡Este campo es requerido!</span>}
      >
        <Controller
          name="reviewTitle"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Resuma su visita o resalte un detalle interesante"
            />
          )}
        />
      </FormControl>
      <FormControl
        label="Detalles de tu opinión"
        htmlFor="reviewDetails"
        error={errors.reviewDetails && <span>¡Este campo es requerido!</span>}
      >
        <Controller
          name="reviewDetails"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input.TextArea
              rows={5}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Cuéntale a la gente sobre tu experiencia en este sitio: ¿cuenta con lo que dice la página?, ubicación, comodidades"
            />
          )}
        />
      </FormControl>
      {/* <FormControl
        label="What Sort of trip was this?"
        htmlFor="tripType"
        error={errors.tripType && <span>This field is required!</span>}
      >
        <Controller
          name="tripType"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <RadioGroup
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              buttonStyle="solid"
              size="large"
              options={[
                { label: 'Business', value: 'business' },
                { label: 'Couples', value: 'couple' },
                { label: 'Family', value: 'family' },
                { label: 'Friends', value: 'friend' },
                { label: 'Solo', value: 'solo' },
              ]}
            />
          )}
        />
      </FormControl>
      <FormControl className="optional-section">
        <GroupTitle>
          Could You Say a Little More About It? <span>(optional)</span>
        </GroupTitle>
        <Description>
          We'd love your opinion ! Anything you can share will help other
          travelers choose their perfect hotel . Thanks
        </Description>
      </FormControl>
      <FormControl className="radio-group-area">
        <Row>
          <Col lg={8}>
            <Label>Is this a quaint hotel?</Label>
          </Col>
          <Col lg={16}>
            <Controller
              name="quaint"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  buttonStyle="solid"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Not Sure', value: 'not-sure' },
                  ]}
                />
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <Label>Does this hotel offer rooms with great views?</Label>
          </Col>
          <Col lg={16}>
            <Controller
              name="roomViews"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  buttonStyle="solid"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Not Sure', value: 'not-sure' },
                  ]}
                />
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <Label>Does this hotel have an indoor pool?</Label>
          </Col>
          <Col lg={16}>
            <Controller
              name="indoorPool"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  buttonStyle="solid"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Not Sure', value: 'not-sure' },
                  ]}
                />
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <Label>Is this a trendy hotel?</Label>
          </Col>
          <Col lg={16}>
            <Controller
              name="isTrendy"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  buttonStyle="solid"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Not Sure', value: 'not-sure' },
                  ]}
                />
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} lg={8}>
            <Label>Is this a romantic hotel?</Label>
          </Col>
          <Col xs={24} lg={16}>
            <Controller
              name="isRomantic"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  buttonStyle="solid"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Not Sure', value: 'not-sure' },
                  ]}
                />
              )}
            />
          </Col>
        </Row>
      </FormControl>
      <Row type="flex" justify="space-between">
        <Col>
          <FormControl label="Service" htmlFor="serviceRatings">
            <Controller
              name="serviceRatings"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Rate onChange={onChange} onBlur={onBlur} value={value} />
              )}
            />
          </FormControl>
        </Col>
        <Col>
          <FormControl label="Rooms" htmlFor="roomsRatings">
            <Controller
              name="roomsRatings"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Rate onChange={onChange} onBlur={onBlur} value={value} />
              )}
            />
          </FormControl>
        </Col>
        <Col>
          <FormControl label="Cleanliness" htmlFor="cleanlinessRatings">
            <Controller
              name="cleanlinessRatings"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Rate onChange={onChange} onBlur={onBlur} value={value} />
              )}
            />
          </FormControl>
        </Col>
        <Col>
          <FormControl label="Food" htmlFor="foodRatings">
            <Controller
              name="foodRatings"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Rate onChange={onChange} onBlur={onBlur} value={value} />
              )}
            />
          </FormControl>
        </Col>
      </Row>
      <FormControl
        label="Add a tip to help travelers choose a good room"
        htmlFor="tips"
      >
        <Controller
          name="tips"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="E. g. Best views, quieter floors, accessibility, etc."
            />
          )}
        />
      </FormControl>
      <FormControl label="Do You have photos to share? (Optional)">
        <DragAndDropUploader
          name="reviewPhotos"
          onUploadChange={(data) => setValue('reviewPhotos', data)}
        />
      </FormControl> */}
      <FormControl
        htmlFor="termsAndCondition"
        error={errors.termsAndCondition && <span>¡Debes aceptar los términos y condiciones antes de continuar!</span>}
      >
        <Controller
          control={control}
          name="termsAndCondition"
          defaultValue={false}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Checkbox onChange={onChange} checked={value}>
              Declaro que esta opinión está basada en mi propia experiencia personal con este establecimiento y refleja mi opinión sincera sobre este establecimiento. No tengo ninguna relación personal o comercial con este establecimiento, al igual que este establecimiento no me ha ofrecido ningún incentivo o pago para escribir esta opinión. Entiendo que esta página tiene una política de tolerancia cero con las reseñas falsas.
            </Checkbox>
          )}
        />
      </FormControl>
      <FormControl className="submit-container">
        <Button htmlType="submit" type="primary" size="large">
          Publicar opinión
        </Button>
      </FormControl>
    </Form>
  );
}
