import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Select } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
// import MapWithSearchBox from 'components/Map/MapSearchBox';
// import { mapDataHelper } from 'components/Map/mapDataHelper';
import addDataAction from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction } from './AddOwner.style';
// const { Option } = Select;

const SiteLocation = ({ setStep, availableLocalities, availableNeighborhoods }) => {
  // let tempLocationData = [];
  // eslint-disable-next-line
  // const [location, setLocation] = useState([]);
  const {
    control,
    register,
    formState: { errors },
    setValue,
    trigger,
    handleSubmit,
    watch,
  } = useForm({
    mode: 'onChange',
  });

  const { actions: actionsUpdate, state } = useStateMachine({ addDataAction });

  const handleOnChange = (key, event) => {
    actionsUpdate.addDataAction({ [key]: (key === "locality" || key === "neighborhood" ? event : event.target.value) });
    setValue(key, (key === "locality" || key === "neighborhood" ? event : event.target.value));
  };

  // Para el mapa
  // useEffect(() => {
  //   register('locationData', { required: true });
  // }, [register]);

  // const selectedLocality = Form.useWatch("locality", form);
  const watchLocality = watch("locality", ""); // Valor por defecto es vacío

  // Cuando cambie la localidad
  useEffect(() => {
      console.log("watchLocality: ", watchLocality)
      actionsUpdate.addDataAction("neighborhood", "");
      setValue("neighborhood", "");
  }, [watchLocality])

  const onSubmit = (data) => {
    // const formData = { ...state.data, ...data };
    actionsUpdate(data);
    setStep(4);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 5 de 5: Ubicación del sitio</Title>
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
            defaultValue={state?.data2?.siteAddress}
            control={control}
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚü\s.,-/#-]{5,255}$/,
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
          htmlFor="locality"
          error={
            errors.locality && errors.locality.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.locality && errors.locality.type === "pattern" ? (
              <span>¡La dirección está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="locality"
            defaultValue={state?.data2?.locality}
            control={control}
            rules={{
              required: true,
              // pattern: /^[a-zA-Z0-9 #,.-]{5,255}$/, // Como es de selección multiple no es necesario el regex
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                value={value}
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('locality', e);
                }}
              >
                {availableLocalities.map(element => {
                  return (
                    <Select.Option key={element.name} value={element.name}>{element.name}</Select.Option>
                  )
                })}
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
            defaultValue={state?.data2?.neighborhood}
            control={control}
            rules={{
              required: true,
              // pattern: /^[a-zA-Z0-9 #,.-]{5,255}$/, // Como es de selección multiple no es necesario el regex
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                value={value}
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('neighborhood', e);
                }}
              >
                {availableNeighborhoods.map(neighborhood => {
                  if (neighborhood.associatedLocality === watchLocality) {
                    return (
                      <Select.Option key={neighborhood.name} value={neighborhood.name}>{neighborhood.name}</Select.Option>
                    )
                  }
                })}
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
      </FormContent >
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
    </form >
  );
};

export default SiteLocation;
