import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Select, message } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction, { addDataResetAction } from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction } from './AddOwner.style';
// const { Option } = Select;
import MapWithSearchBox from 'components/Map/MapSearchBox';
import { mapDataHelper } from 'components/Map/mapDataHelper';
import axios from "../../../../settings/axiosConfig"; // Para la petición de registro
import { useNavigate } from 'react-router-dom';

const SiteLocation = ({ setStep, availableLocalities, availableNeighborhoods }) => {
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
  const { actions: actionsReset } = useStateMachine({ addDataResetAction });

  const navigate = useNavigate();

  const handleOnChange = (key, event) => {
    actionsUpdate.addDataAction({ [key]: (key === "locality" || key === "neighborhood" || key === "location" ? event : event.target.value) });
    setValue(key, (key === "locality" || key === "neighborhood" || key === "location" ? event : event.target.value));
    if (key === "locality") { // Cuando cambie la localidad ponga en blanco el campo de barrio
      setValue("neighborhood", "")
      actionsUpdate.addDataAction({ "neighborhood": "" });
    }
  };

  // const selectedLocality = Form.useWatch("locality", form);
  const watchLocality = watch("locality", ""); // Valor por defecto es vacío

  useEffect(() => { // (no estoy seguro por qué se usa aquí)
    register('location', { required: true });
  }, [register]);

  const aux1 = [];
  const imgsCloudinary = state?.data2?.sitePhotos?.map(async (img) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(img.originFileObj);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    }).then(result=>{
      aux1.push(result);
    });
  });

  const onSubmit = async (data) => {

    const formData = { ...state.data2, ...data, sitePhotos: aux1 };

    message.loading("Subiendo registro, por favor espera", 0)
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/registerOwner`, formData);
      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 5);
          // setTimeout(function () {
          // actionsReset.addDataResetAction(); // Para resetear los campos una vez termine el registro
          navigate('/sign-in', { replace: true }); // El {replace: true} es para que la página anterior sea igual a la actual: https://reach.tech/router/api/navigate
          // }, 3000);
          actionsReset.addDataResetAction();
        } else message.warning(res.status + " - Respuesta del servidor desconocida");
      }
    } catch (error) {
      message.destroy();
      if (typeof error.response.status === 'undefined') {

        message.warning({ content: "Error de conectividad con el servidor", duration: 5 });
      } else {
        if (error.response.status >= 400 && error.response.status <= 499) { // Errores del cliente

          message.warning({ content: error.response.data.message, duration: 5 });
        }
        else if (error.response.status >= 500 && error.response.status <= 599) {

          message.error({ content: error.response.data.message, duration: 5 });
        } // Errores del servidor
        else {

          message.warning({ content: error.response.status + " - Error de conectividad con el servidor", duration: 5 });
        }
      }
    }


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
                placeholder="Escribe tu dirección aquí"
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
                placeholder="Selecciona una localidad"
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
                placeholder="Selecciona un barrio"
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

        {/* Selección de ubicación en el mapa */}
        <FormControl
          label="Ubicación en el mapa"
          htmlFor="location"
          error={errors.location && <span>¡Este campo es requerido!</span>}
        >
          <MapWithSearchBox
            name="location"
            updateValue={(value) => {
              // tempLocationData = mapDataHelper(value);
              handleOnChange('location', mapDataHelper(value)[0])
              // setValue('location', tempLocationData);
              // setLocation({ lat: value[0].geometry.location.lat(), lng: value[0].geometry.location.lng() }); // Ajustamos un objeto con longitud y latitud en el estado de LSM
            }}
          />
        </FormControl>
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