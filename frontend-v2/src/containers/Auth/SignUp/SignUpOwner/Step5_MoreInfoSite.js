import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Select, message, Row, Col, TimePicker, Switch, Popover } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction, { addDataResetAction } from './AddOwnerAction';
import { FormHeader, Title, FormContent, FormAction } from './AddOwner.style';
// const { Option } = Select;
import MapWithSearchBox from 'components/Map/MapSearchBox';
import { mapDataHelper } from 'components/Map/mapDataHelper';
import axios from "../../../../settings/axiosConfig"; // Para la petición de registro
import { Form, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { GrMultiple } from "react-icons/gr";

const daysOfTheWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

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

  // const [schedule, setSchedule] = useState({
  //   Lunes: state.data2.schedule && state.data2.schedule["Lunes"] ? state.data2.schedule["Lunes"] : { start: null, end: null },
  //   Martes: state.data2.schedule && state.data2.schedule["Martes"] ? state.data2.schedule["Martes"] : { start: null, end: null },
  //   Miercoles: state.data2.schedule && state.data2.schedule["Miercoles"] ? state.data2.schedule["Miercoles"] : { start: null, end: null },
  //   Jueves: state.data2.schedule && state.data2.schedule["Jueves"] ? state.data2.schedule["Jueves"] : { start: null, end: null },
  //   Viernes: state.data2.schedule && state.data2.schedule["Viernes"] ? state.data2.schedule["Viernes"] : { start: null, end: null },
  //   Sabado: state.data2.schedule && state.data2.schedule["Sabado"] ? state.data2.schedule["Sabado"] : { start: null, end: null },
  //   Domingo: state.data2.schedule && state.data2.schedule["Domingo"] ? state.data2.schedule["Domingo"] : { start: null, end: null },
  // });

  const [isClose, setIsClose] = useState(); // Para el botón de Abierto/cerrado del horario

  useEffect(() => {
    const updateIsClose = () => {
      setIsClose(state && state.data2 && state.data2.isClose ?
        (state.data2.isClose) :
        {
          Lunes: state?.data2?.isClose?.Lunes?.start || state?.data2?.schedule?.Lunes?.[0] ? false : true,
          Martes: state?.data2?.schedule?.Martes?.start || state?.data2?.schedule?.Martes?.[0] ? false : true,
          Miercoles: state?.data2?.schedule?.Miercoles?.start || state?.data2?.schedule?.Miercoles?.[0] ? false : true,
          Jueves: state?.data2?.schedule?.Jueves?.start || state?.data2?.schedule?.Jueves?.[0] ? false : true,
          Viernes: state?.data2?.schedule?.Viernes?.start || state?.data2?.schedule?.Viernes?.[0] ? false : true,
          Sabado: state?.data2?.schedule?.Sabado?.start || state?.data2?.schedule?.Sabado?.[0] ? false : true,
          Domingo: state?.data2?.schedule?.Domingo?.start || state?.data2?.schedule?.Domingo?.[0] ? false : true,
        }
      )
    }

    updateIsClose();
  }, [])

  useEffect(() => {
    actionsUpdate.addDataAction({ 'isClose': isClose });
    // setValue('isClose', isClose);
  }, [isClose])

  const handleOnChange = (key, event) => {
    console.log("key: ", key);
    console.log("event: ", event);
    if (key.startsWith("schedule.")) {
      // console.log("start ", event[0] && event[0]);
      // console.log("end ", event[1] && event[1]);
      let auxSchedule = state?.data2?.schedule ? state.data2.schedule : {}; // Si no se ha inicializado el horario en el LSM
      let day = key.split(".")[1];

      if (!auxSchedule[day]) {
        auxSchedule[day] = {}; // Initialize the schedule for the specific day if it doesn't exist
      }

      if (!event && Array.isArray(auxSchedule[day])) { // Para resolver problema. 
        auxSchedule[day][0] = null;
        auxSchedule[day][1] = null;
      }
      else {
        auxSchedule[day].start = event?.[0]?._d ?? null;
        auxSchedule[day].end = event?.[1]?._d ?? null;
      }

      console.log(auxSchedule)

      actionsUpdate.addDataAction({ 'schedule': auxSchedule });
      setValue('schedule', auxSchedule);
    } else {
      actionsUpdate.addDataAction({ [key]: (key === "locality" || key === "neighborhood" || key === "location" ? event : event.target.value) });
      setValue(key, (key === "locality" || key === "neighborhood" || key === "location" ? event : event.target.value));
      if (key === "locality") { // Cuando cambie la localidad ponga en blanco el campo de barrio
        setValue("neighborhood", "")
        actionsUpdate.addDataAction({ "neighborhood": "" });
      }
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
    }).then(result => {
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
          <Title>Paso 5 de 5: Horario y ubicación del sitio</Title>
        </FormHeader>

        <FormControl
          label="Horario"
          htmlFor="schedule"
          error={
            errors.siteAddress && errors.siteAddress.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.siteAddress && errors.siteAddress.type === "pattern" ? (
              <span>¡La dirección está en un formato no válido!</span>
            ) : null
          }
        >
          {
            daysOfTheWeek.map((day, index) => {
              return (
                <Row
                  gutter={0}
                  key={day}
                  style={{
                    marginBottom: '10px',
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                  }}>
                  <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginLeft: '20px' }}>
                      {day}:
                    </div>
                  </Col>
                  <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Switch checked={!isClose?.[day]} checkedChildren="Abierto" unCheckedChildren="Cerrado" onChange={() => { setIsClose({ ...isClose, [day]: !isClose[day] }); }} />
                  </Col>
                  <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Controller
                      name={`schedule.${day}`}
                      control={control}
                      defaultValue={[
                        // state?.data2?.schedule?.[day]?.start ? moment(state.data2.schedule[day].start, "HH:mm") : (state.data2.schedule[day]?.[0] && moment(state.data2.schedule[day][0], "HH:mm")),
                        // state?.data2?.schedule?.[day]?.end ? moment(state.data2.schedule[day].end, "HH:mm") : (state.data2.schedule[day]?.[1] && moment(state.data2.schedule[day][1], "HH:mm")),
                      ]}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TimePicker.RangePicker
                          format="HH:mm"
                          onChange={(e) => { // Cuando el usuario cambia el valor del campo
                            onChange(e);
                            handleOnChange(`schedule.${day}`, e);
                            trigger(`schedule.${day}`);
                          }}
                          minuteStep={5}
                          onBlur={() => { // Cuando el usuario quita el focus del campo
                            trigger(`schedule.${day}`);
                            onBlur();
                          }}
                          value={!isClose?.[day] ? value : null}
                          placeholder={['Apertura', 'Cierre']}
                          disabled={isClose?.[day]}
                        />
                      )}
                    />
                  </Col>
                  <Col span={2}>
                    <Popover content="Ajustar este horario para los demás días">
                      <Button icon={<GrMultiple />} style={{ width: '100%', height: '100%' }} />
                    </Popover>
                  </Col>
                </Row>
              );
            })
          }
        </FormControl>

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

export default SiteLocation;