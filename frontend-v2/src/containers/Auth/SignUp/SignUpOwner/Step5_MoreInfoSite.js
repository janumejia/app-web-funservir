import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Select } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
// import MapWithSearchBox from 'components/Map/MapSearchBox';
// import { mapDataHelper } from 'components/Map/mapDataHelper';
import AddOwnerAction from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction } from './AddOwner.style';
const { Option } = Select;

const HotelLocation = ({ setStep }) => {
  let tempLocationData = [];
  const { actions: actionsUpdate, state } = useStateMachine({ AddOwnerAction });
  // eslint-disable-next-line
  const [location, setLocation] = useState([]);
  const {
    control,
    register,
    formState: { errors },
    setValue,
    trigger,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    register('locationData', { required: true });
  }, [register]);

  const onSubmit = (data) => {
    actionsUpdate(data);
    setStep(5);
  };

  const handleOnChange = (key, event) => {
    actionsUpdate.addDataAction({ [key]: (key === 'condition' || key === 'dateOfBirth' ? event : event.target.value) });
    setValue(key, (key === 'condition' || key === 'dateOfBirth' ? event : event.target.value));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 5 de 5: Información geográfica del sitio</Title>
        </FormHeader>
        <FormControl
          label="Dirección"
          htmlFor="siteAddress"
          error={
            errors.siteAddress && errors.siteAddress.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.siteAddress && errors.siteAddress.type === "pattern" ? (
              <span>¡La dirección está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="siteAddress"
            defaultValue={state?.data?.siteAddress}
            control={control}
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9 #,.-]{5,255}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('siteAddress', e);
                  trigger("siteAddress");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("siteAddress");
                  onBlur();
                }}
                value={value}
                placeholder="Escribe tu dirección."
              />
            )}
          />
        </FormControl>

        <FormControl
          label="Localidad"
          htmlFor="location"
          error={
            errors.location && errors.location.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.location && errors.location.type === "pattern" ? (
              <span>¡La dirección está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="location"
            defaultValue={state?.data?.location}
            control={control}
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9 #,.-]{5,255}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select defaultValue="Localidad2">
                <Option value="Localidad1">Localidad1</Option>
                <Option value="Localidad2">Localidad2</Option>
              </Select>
            )}
          />
        </FormControl>

        <FormControl
          label="Barrio"
          htmlFor="neighborhood"
          error={
            errors.neighborhood && errors.neighborhood.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.neighborhood && errors.neighborhood.type === "pattern" ? (
              <span>¡La dirección está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="neighborhood"
            defaultValue={state?.data?.neighborhood}
            control={control}
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9 #,.-]{5,255}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select defaultValue="Barrio1">
                <Option value="Barrio1">Barrio1</Option>
                <Option value="Barrio2">Barrio2</Option>
              </Select>
            )}
          />
        </FormControl>
        {/* <FormControl
          error={errors.locationData && <span>This field is required!</span>}
        >
          <MapWithSearchBox
            name="locationData"
            updateValue={(value) => {
              tempLocationData = mapDataHelper(value);
              setValue('locationData', tempLocationData);
              setLocation(value);
            }}
          />
        </FormControl> */}
      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button
            className="back-btn"
            htmlType="button"
            onClick={() => setStep(4)}
          >
            <IoIosArrowBack /> Volver
          </Button>
          <Button type="primary" htmlType="submit">
            Terminar registro
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default HotelLocation;
