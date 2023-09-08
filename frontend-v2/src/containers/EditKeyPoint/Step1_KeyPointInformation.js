import { useStateMachine } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { useForm, Controller } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { Row, Col, Input, Button, Select, InputNumber, Tooltip, Radio, message } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import editDataAction, { editDataResetAction } from './AddCreateKeyPointAction';
import { FormHeader, Title, Description, FormContent, FormAction, StyledInputNumber, ColombiaFlag } from './AddCreateKeyPoint.style';
import axios from "../../settings/axiosConfig"; // Para la petición de registro
import {
  IoLogoWhatsapp,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
} from 'react-icons/io';
import { AiFillInfoCircle, AiOutlineInfoCircle, AiOutlineLaptop } from "react-icons/ai";
import { BsExclamationTriangle, BsFillInfoCircleFill, BsInfoCircle, BsUniversalAccess } from 'react-icons/bs';
import { FaWheelchair } from 'react-icons/fa';
import MapWithSearchBox from 'components/Map/MapSearchBox';
import { mapDataHelper } from 'components/Map/mapDataHelper';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LISTING_KEYPOINTS_PAGE } from 'settings/constant';

const { Option } = Select;

const infoInToolTip = {
  "inclusiveElements": "Los elementos inclusivos son características que un sitio puede ofrecer para facilitar el acceso a personas con discapacidades. Ejemplos de estos elementos incluyen rampas para sillas de ruedas, lenguaje en braille y pasamanos.",
}

const inclusiveSiteNameVerification = async (siteName) => {
  try {
    await axios.post(`${process.env.REACT_APP_HOST_BACK}/uniqueSiteNameValidator`, { siteName: siteName });
    // No se hace nada aquí, solo cuando el nombre está repetido se informa

  } catch (error) {
    if (typeof error.response.status !== 'undefined' && error.response.status === 409) return false; // Invalido

  }
  return true; // Válido
}

const AccountDetails = ({ setStep, availableCategories, availableElements, initialData }) => {
  // const { actions, state } = useStateMachine({ addDataAction }); // Usamos el estado global de StateMachine
  const { actions: actionsUpdate, state } = useStateMachine({ editDataAction });
  const { actions: actionsReset } = useStateMachine({ editDataResetAction });


  const navigate = useNavigate();

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
    trigger, // Lo importamos para validar que la entrada del usuario se cumpla mientras se está editando
  } = useForm({
    defaultValues: { // Valores por defecto del formularios
      classification: state?.dataAddKeyPoint?.classification || initialData?.classification,
      title: state?.dataAddKeyPoint?.title || initialData?.title,
      description: state?.dataAddKeyPoint?.description || initialData?.description,
      // location: state?.dataAddKeyPoint?.location,
    },
  });

  const handleOnChange = (key, event) => {
    actionsUpdate.editDataAction({ [key]: (key === "sitePhotos" || key === "inclusiveElements" || key === "location" || key === "location2" ? event : event.target.value) });
    setValue(key, (key === "sitePhotos" || key === "inclusiveElements" || key === "location" || key === "location2" ? event : event.target.value));
  };

  const [auxPhotos, setAuxPhotos] = useState([]);
  const [auxPhotosToKeep, setAuxPhotosToKeep] = useState(initialData.gallery.map(e => e.public_id));

  // const updatePhotos = async (event) => {
  //   console.log("event: ", event)
  //   if (event) {
  //     let aux1 = auxPhotos;
  //     await event.map(async (img) => {
  //       new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(img.originFileObj);
  //         reader.onload = () => resolve(reader.result);
  //         reader.onerror = (error) => reject(error);
  //       }).then(result => {
  //         aux1.push(result);
  //       });
  //     });

  //     setAuxPhotos(aux1);
  //   }
  // }


  // console.log("initialData --> ", initialData)
  console.log("auxPhotosToKeep -> ", auxPhotosToKeep)
  const updatePhotos = async (event) => {
    if (event) {
      let aux1 = [];
      let aux2 = [];

      await event.map(async (img) => {
        try {
          if (!img.originFileObj) { // Es imagen que ya estaba y se quiere conservar
            aux2.push(img.name)

          } else { // es imagen nueva
            const reader = new FileReader();
            reader.readAsDataURL(img.originFileObj);
            reader.onload = () => { aux1.push((reader.result)); }
            reader.onerror = (error) => { throw new Error(error); }

          }
        } catch (error) {
          console.log("error")
        }
      });

      setAuxPhotos(aux1);
      setAuxPhotosToKeep(aux2);
    }
  }

  const onSubmit = async (data) => {

    console.log("AuxPhotos: ", auxPhotos)
    console.log("AuxPhotosToKeep: ", auxPhotosToKeep)
    try {
      // console.log("auxPhotosToKeep: ", auxPhotosToKeep)
      
      const imgsToRemove = initialData.gallery
        .filter(img => !auxPhotosToKeep.includes(img.public_id))
        .map(img => img.public_id);

      console.log("imgsToRemove: ", imgsToRemove)

      const formData = {
        _id: initialData._id,
        classification: data.classification,
        title: data.title,
        description: data.description,
        sitePhotos: auxPhotos,
        photosToRemove: imgsToRemove,
        location: data?.location?.lat ? { lat: data.location.lat.toString(), lng: data.location.lng.toString() } : { lat: initialData.location.lat.toString(), lng: initialData.location.lng.toString() },
        formattedAddress: data?.location?.formattedAddress || initialData.formattedAddress,
      };

      message.loading("Subiendo registro, por favor espera", 0)
      console.log({ ...formData })
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/editKeyPoint`, { ...formData });
      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 6);
          // setTimeout(function () {
          // actionsReset.editDataResetAction(); // Para resetear los campos una vez termine el registro
          navigate(`${LISTING_KEYPOINTS_PAGE}/${initialData._id}`, { replace: true }); // El {replace: true} es para que la página anterior sea igual a la actual: https://reach.tech/router/api/navigate
          // }, 3000);
          actionsReset.editDataResetAction();
        } else message.warning("Respuesta del servidor desconocida");
      }
    } catch (error) {
      console.log(error)
      message.destroy();
      if (!error || !error.response || !error.response.status || typeof error.response.status === 'undefined') {

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
          <Title>Creación de Lugar Clave</Title>
          {/* <Description>
            Completa los datos del lugar clave y publicalo.
          </Description> */}
        </FormHeader>
        <FormControl
          label={"Clasificación"}
          htmlFor="classification"
          error={
            errors.classification && errors.classification.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.classification && errors.classification.type === "isclassificationValid" ? (
              <span> {errors.classification.message} </span>
            ) : null
          }
        >
          <Controller
            name="classification"
            // defaultValue={state?.dataEditSite?.classification || initialData}
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Radio.Group
                buttonStyle="solid"
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('classification', e);
                  trigger("classification");
                }}
                value={value}
              >
                <Radio.Button value="inclusiveElement" className="tall-button">
                  <div className="icon-text-container">
                    <div><FaWheelchair /></div>
                    <div>Elemento inclusivo</div>
                  </div>
                </Radio.Button>
                <Radio.Button value="architecturalBarrier" className="tall-button">
                  <div className="icon-text-container">
                    <div><BsExclamationTriangle /></div>
                    <div>Barrera arquitectónica</div>
                  </div>
                </Radio.Button>
              </Radio.Group>
            )}
          />
        </FormControl>
        <FormControl
          label="Titulo"
          htmlFor="title"
          error={
            errors.title && errors.title.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.title && errors.title.type === "pattern" ? (
              <span>¡El nombre está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="title"
            defaultValue={state?.dataEditSite?.title}
            control={control}
            rules={{
              required: true,
              pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:-]){1,255}$/,
              // validate: {
              //   isTitleValid: async (value) => {
              //     const pattern = /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:-]){1,255}$/;
              //     return !pattern.test(value) && "¡El nombre está en un formato no válido!";
              //   }
              // }

            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('title', e);
                  trigger("title");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("title");
                  onBlur();
                }}
                value={value}
                placeholder="Escribe un titulo aquí"
              />
            )}
          />
        </FormControl>

        <FormControl
          label={
            <div>
              Descripción
              <div style={{ marginLeft: '4px', display: 'inline', opacity: 0.6 }}>(Opcional)</div>
            </div>
          }
          htmlFor="description"
          error={
            errors.description && errors.description.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.description && errors.description.type === "pattern" ? (
              <span>¡La descripción está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="description"
            defaultValue={state?.dataEditSite?.description || ""}
            control={control}
            rules={{
              required: false,
              pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){0,2000}$/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input.TextArea
                rows={3}
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('description', e);
                  trigger("description");
                }}
                onBlur={onBlur}
                value={value}
                placeholder="Comparte una breve descripción del punto clave para dar una idea a los usuarios de lo que pueden encontrar aquí."
              />
            )}
          />
        </FormControl>

        <FormControl
          label={
            <div>
              Fotos
              <div style={{ marginLeft: '4px', display: 'inline', opacity: 0.6 }}>(Opcional)</div>
            </div>
          }
          htmlFor="sitePhotos"
          error={errors.location && <span>¡Este campo es requerido!</span>}
        >
          <DragAndDropUploader
            name="sitePhotos"
            value={initialData.gallery.map((img) => {
              return {
                asset_id: img.asset_id,
                public_id: img.public_id,
                url: img.secure_url,
                thumbUrl: img.secure_url
              }
            })}
            onUploadChange={(e) => {
              updatePhotos(e);
              // handleOnChange('sitePhotos', e);
              // trigger("sitePhotos");
            }}
          />
        </FormControl>

        {/* Selección de ubicación en el mapa */}
        <FormControl
          label="Ubicación en el mapa"
          htmlFor="location"
          error={errors.location && <span>¡Este campo es requerido!</span>}
        >
          <MapWithSearchBox
            setUserLocation={false}
            name="location"
            updateValue={(value) => {
              handleOnChange('location', mapDataHelper(value)[0])
              // setValue('location', tempLocationData);
              // setLocation({ lat: value[0].geometry.location.lat(), lng: value[0].geometry.location.lng() }); // Ajustamos un objeto con longitud y latitud en el estado de LSM
            }}
            defaultValue={state?.dataEditSite?.location || initialData?.location}
          />
        </FormControl>
      </FormContent>
      <FormAction>
        <div className="inner-wrapper">
          <Button type="primary" htmlType="submit">
            Publicar lugar clave
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default AccountDetails;
