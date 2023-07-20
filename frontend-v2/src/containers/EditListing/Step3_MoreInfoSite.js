import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useStateMachine } from 'little-state-machine';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Select, message, TimePicker, Col, Switch, Row } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import EditDataAction, { EditDataResetAction } from './EditListingAction';
import { FormHeader, Title, FormContent, FormAction } from './EditListing.style';
import MapWithSearchBox from 'components/Map/MapSearchBox';
import { mapDataHelper } from 'components/Map/mapDataHelper';
import axios from "../../settings/axiosConfig"; // Para la petición de registro
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const daysOfTheWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo", "SolucionBug"]; // No borrar elemento "SolucionBug"
const initialIsClose = {
  Lunes: true,
  Martes: true,
  Miercoles: true,
  Jueves: true,
  Viernes: true,
  Sabado: true,
  Domingo: true,
}

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

  const { actions: actionsUpdate, state } = useStateMachine({ EditDataAction });
  const { actions: actionsReset } = useStateMachine({ EditDataResetAction });

  const navigate = useNavigate();

  const [isClose, setIsClose] = useState(initialIsClose); // Para el botón de Abierto/cerrado del horario

  useEffect(() => {
    if (state?.dataEditSite?.isClose) setIsClose(state.dataEditSite.isClose);
    handleOnChange(`schedule.SolucionBug`, null); // No borrar linea

  }, [])

  useEffect(() => {
    actionsUpdate.EditDataAction({ 'isClose': isClose });

  }, [isClose])

  const handleOnChange = (key, event) => {

    if (key.startsWith("schedule.")) {
      // console.log("start ", event[0] && event[0]);
      // console.log("end ", event[1] && event[1]);
      let auxSchedule = state?.dataEditSite?.schedule ? state.dataEditSite.schedule : {}; // Si no se ha inicializado el horario en el LSM
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

      actionsUpdate.EditDataAction({ 'schedule': auxSchedule });
      setValue('schedule', auxSchedule);
    } else {
      actionsUpdate.EditDataAction({ [key]: (key === "locality" || key === "neighborhood" || key === "location" ? event : event.target.value) });
      setValue(key, (key === "locality" || key === "neighborhood" || key === "location" ? event : event.target.value));
      if (key === "locality") { // Cuando cambie la localidad ponga en blanco el campo de barrio
        setValue("neighborhood", "")
        actionsUpdate.EditDataAction({ "neighborhood": "" });
      }
    }
  };

  // const selectedLocality = Form.useWatch("locality", form);
  const watchLocality = watch("locality", ""); // Valor por defecto es vacío

  useEffect(() => { // (no estoy seguro por qué se usa aquí)
    register('location', { required: true });
  }, [register]);

  const aux1 = [];
  const imgsCloudinary = state?.dataEditSite?.sitePhotos?.map(async (img) => {
    console.log(img);
    if (img.thumbUrl) {
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(img.originFileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }).then(result => {
        aux1.push(result);
      });
    }
  });

  const onSubmit = async (data) => {

    const formData = { ...state.dataEditSite, ...data, addedPhotos: aux1 };

    // Eliminar propiedades innecesarias creadas para el horario
    delete formData.schedule['SolucionBug'];

    Object.keys(formData.schedule).forEach((key) => {
      if (!Array.isArray(formData.schedule[key]) || isClose[key]) formData.schedule[key] = [null, null];
    });

    const convertedObj = {};

    console.log("Antes: ", formData.schedule)

    for (const key in formData.schedule) {
      if (formData.schedule.hasOwnProperty(key)) {
        const { start, end } = formData.schedule[key];
        const convertedHours = {
          start: start ? moment.utc(start, 'HH:mm').utcOffset('-05:00').format('HH:mm') : null,
          end: end ? moment.utc(end, 'HH:mm').utcOffset('-05:00').format('HH:mm') : null
        };
        convertedObj[key] = convertedHours;
      }
    }

    console.log("Despues: ", convertedObj)

    delete formData['isClose'];

    message.loading("Subiendo registro, por favor espera", 0)

    try {
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/editSite`,  { ...formData, schedule: convertedObj });
      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 6);
          // setTimeout(function () {
          // actionsReset.EditDataResetAction(); // Para resetear los campos una vez termine el registro
          navigate('/', { replace: true }); // El {replace: true} es para que la página anterior sea igual a la actual: https://reach.tech/router/api/navigate
          // }, 3000);
          actionsReset.EditDataResetAction();
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
            errors.schedule && errors.schedule.type === "required" ? (
              <span />
            ) : null
          }
        >
          {
            daysOfTheWeek.slice(0, -1).map((day, index) => {
              return (
                <>
                  <Row
                    gutter={0}
                    key={day}
                    style={{
                      marginTop: '10px',
                      backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                    }}>
                    <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ marginLeft: '20px' }}>
                        {day}:
                      </div>
                    </Col>
                    <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Switch checked={!isClose[day]} checkedChildren="Abierto" unCheckedChildren="Cerrado" onChange={() => { setIsClose({ ...isClose, [day]: !isClose[day] }); }} />
                    </Col>
                    <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Controller
                        name={`schedule.${day}`}
                        control={control}
                        defaultValue={[
                          state?.dataEditSite?.schedule?.[day]?.start ? moment(state.dataEditSite.schedule[day].start, "HH:mm") : (state?.dataEditSite?.schedule?.[day]?.[0] && moment(state.dataEditSite.schedule[day][0], "HH:mm")),
                          state?.dataEditSite?.schedule?.[day]?.end ? moment(state.dataEditSite.schedule[day].end, "HH:mm") : (state?.dataEditSite?.schedule?.[day]?.[1] && moment(state.dataEditSite.schedule[day][1], "HH:mm")),
                        ]}
                        required={!isClose[day]}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TimePicker.RangePicker
                            format="HH:mm"
                            onChange={(e) => { // Cuando el usuario cambia el valor del campo
                              console.log(e);
                              onChange(e);
                              handleOnChange(`schedule.${day}`, e);
                              trigger(`schedule.${day}`);
                            }}
                            minuteStep={5}
                            onBlur={() => { // Cuando el usuario quita el focus del campo
                              trigger(`schedule.${day}`);
                              onBlur();
                            }}
                            value={!isClose[day] ? value : null}
                            placeholder={['Apertura', 'Cierre']}
                            disabled={isClose[day]}
                          // required={!isClose[day]} // Add the required attribute when isClose[day] is true
                          />
                        )}
                      />
                    </Col>

                    {/* Boton de agregar el mismo horario a todos los dias, pero no logre solucionar un bug */}
                    {/* <Col span={2}>
                      <Popover content="Ajustar este horario para los demás días">
                        <Button onClick={() => setSameScheduleToall(day)} icon={<GrMultiple />} style={{ width: '100%', height: '100%' }} />
                      </Popover>
                    </Col> */}

                  </Row>
                  {/* {!isClose[day] && !(state?.dataEditSite?.schedule?.[day]?.start || state?.dataEditSite?.schedule?.[day]?.[0]) && isSubmitted && (
                    <>
                      {setError('schedule', { type: 'required' })}
                      <Typography.Text type="danger">¡Falta ajusta el horario para este día! De lo contrario, marcalo como cerrado</Typography.Text>
                    </>
                  )
                  } */}
                </>
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
            defaultValue={state?.dataEditSite?.siteAddress}
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
            defaultValue={state?.dataEditSite?.locality}
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
            defaultValue={state?.dataEditSite?.neighborhood}
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
            onClick={() => setStep(2)}
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
