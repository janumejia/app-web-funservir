import { useStateMachine } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { useForm, Controller } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { Row, Col, Input, Button, Select, InputNumber, Divider } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction from './AddOwnerAction';
import { FormHeader, Title, Description, FormContent, FormAction, StyledInputNumber, ColombiaFlag } from './AddOwner.style';
import axios from "../../../../settings/axiosConfig"; // Para la petición de registro
import {
  IoLogoWhatsapp,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
} from 'react-icons/io';
import { AiOutlineLaptop } from "react-icons/ai";
import { useState } from 'react';

const { Option } = Select;

const inclusiveSiteNameVerification = async (siteName) => {
  try {
    await axios.post(`${process.env.REACT_APP_HOST_BACK}/uniqueSiteNameValidator`, { siteName: siteName });
    // No se hace nada aquí, solo cuando el nombre está repetido se informa

  } catch (error) {
    if (typeof error.response.status !== 'undefined' && error.response.status === 409) return false; // Invalido

  }
  return true; // Válido
}

const AccountDetails = ({ setStep, availableCategories, availableElements }) => {
  const { actions, state } = useStateMachine({ addDataAction }); // Usamos el estado global de StateMachine

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    trigger, // Lo importamos para validar que la entrada del usuario se cumpla mientras se está editando
    watch,
  } = useForm({
    defaultValues: { // Valores por defecto del formularios
      siteName: state?.data2?.sitesitesiteName,
      description: state?.data2?.description,
      contactNumber: state?.data2?.contactNumber,
      contactNumber2: state?.data2?.contactNumber2,
      category: state?.data2?.category,
      inclusiveElements: state?.data2?.inclusiveElements
    },
  });

  const handleOnChange = (key, event) => {
    actions.addDataAction({ [key]: (key === "category" || key === "inclusiveElements" ? event : event.target.value) });
    setValue(key, (key === "category" || key === "inclusiveElements" ? event : event.target.value));
  };

  const watchcontactNumber = watch("contactNumber", ""); // Valor por defecto es vacío

  const onSubmit = (data2) => {
    actions.addDataAction(data2); // Guardar la información ingresada en el estado de StateMachine
    setStep(4); // Pasar a la siguiente página de registro
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 3 de 5: Datos del sitios de interés</Title>
          <Description>
            Completa los datos de tu cuenta para iniciar sesión en la aplicación.
          </Description>
        </FormHeader>
        <FormControl
          label="Nombre del sitio"
          htmlFor="siteName"
          error={
            errors.siteName && errors.siteName.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : errors.siteName && errors.siteName.type === "isSiteNameValid" ? (
              <span> {errors.siteName.message} </span>
            ) : null
          }
        >
          <Controller
            name="siteName"
            defaultValue={state?.data2?.siteName}
            control={control}
            rules={{
              required: true,
              // pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:-]){1,255}$/,
              validate: {
                isSiteNameValid: async (value) => {
                  const pattern = /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:-]){1,255}$/;
                  return pattern.test(value) ? (await inclusiveSiteNameVerification(value) ? true : "¡Este nombre ya se encuentra registrado!") : "¡El nombre está en un formato no válido!";
                }
              }

            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('siteName', e);
                  trigger("siteName");
                }}
                onBlur={() => { // Cuando el usuario quita el focus del campo
                  trigger("siteName");
                  onBlur();
                }}
                value={value}
                placeholder="Escribe el nombre aquí"
              />
            )}
          />
        </FormControl>

        <FormControl
          label="Descripción"
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
            defaultValue={state?.data2?.description}
            control={control}
            rules={{
              required: true,
              pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){1,2000}$/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input.TextArea
                rows={5}
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('description', e);
                  trigger("description");
                }}
                onBlur={onBlur}
                value={value}
                placeholder="Comparte una breve descripción de tu sitio para dar una idea a los usuarios de lo que pueden encontrar aquí."
              />
            )}
          />
        </FormControl>


        <FormControl
          label="Categoría"
          htmlFor="category"
          error={
            errors.category && errors.category.type === "required" ? (
              <span>¡Este campo es requerido!</span>
            ) : null
          }
        >
          <Controller
            name="category"
            defaultValue={state?.data2?.category}
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              // Sort the availableCategories array alphabetically by name
              const sortedCategories = [...availableCategories].sort((a, b) =>
                a.name.localeCompare(b.name)
              );

              return (
                <Select
                  showSearch
                  onChange={(e) => {
                    onChange(e);
                    handleOnChange('category', e);
                  }}
                  value={value}
                >
                  {sortedCategories.map(element => (
                    <Select.Option key={element.name} value={element.name}>
                      {element.name}
                    </Select.Option>
                  ))}
                </Select>
              );
            }}
          />
        </FormControl>

        <FormControl
          label="Elementos inclusivos"
          htmlFor="inclusiveElements"
        // error={
        //   errors.inclusiveElements && errors.inclusiveElements.type === "required" ? (
        //     <span>¡Este campo es requerido!</span>
        //   ) : null
        // }
        >
          <Controller
            name="inclusiveElements"
            defaultValue={state && state.data2 && state.data2.inclusiveElements ? state.data2.inclusiveElements : []}
            control={control}
            // rules={{
            //   required: true,
            // }}
            render={({ field: { onChange, onBlur, value } }) => {
              // Sort the availableElements array alphabetically by name
              const sortedElements = [...availableElements].sort((a, b) =>
                a.name.localeCompare(b.name)
              );

              return (
                <Select
                  showSearch
                  mode="multiple"
                  style={{
                    width: '100%',
                  }}
                  placeholder="Seleccione una o varias opciones"
                  allowClear={true}
                  onChange={(e) => {
                    onChange(e);
                    handleOnChange('inclusiveElements', e);
                  }}
                  value={value}
                >
                  {sortedElements.map(element => (
                    <Select.Option key={element._id} value={element._id}>
                      {element.name}
                    </Select.Option>
                  ))}
                </Select>
              );
            }}
          />
        </FormControl>
        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Números telefónicos"
              htmlFor="contactNumber"
              error={
                errors.contactNumber && errors.contactNumber.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.contactNumber && errors.contactNumber.type === "pattern" ? (
                  <span>¡El teléfono debe tener 10 dígitos numéricos!</span>
                ) : null
              }
            >
              <Controller
                name="contactNumber"
                defaultValue={state?.data2?.contactNumber}
                control={control}
                rules={{
                  required: true,
                  pattern: /^\d{10}$/ // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ColombiaFlag style={{ marginRight: '5px' }} /> +57
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input
                      rows={5}
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                        handleOnChange('contactNumber', e);
                        trigger("contactNumber");
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Número telefónico principal"
                    />
                  </div>
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="&nbsp;"
              htmlFor="contactNumber2"
              error={
                errors.contactNumber2 && errors.contactNumber2.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.contactNumber2 && errors.contactNumber2.type === "pattern" ? (
                  <span>¡El teléfono debe tener 10 dígitos numéricos!</span>
                ) : errors.contactNumber2 && errors.contactNumber2.type === "validate" ? (
                  <span>¡Los números telefónicos no deben ser iguales!</span>
                ) : null
              }
            >
              <Controller
                name="contactNumber2"
                defaultValue={state && state.data2 && state.data2.contactNumber2 ? state.data2.contactNumber2 : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^\d{10}$|^$/, // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                  validate: (value) => 
                    value !== watchcontactNumber || false,
                  
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ColombiaFlag style={{ marginRight: '5px' }} /> +57
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input
                      rows={5}
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                        handleOnChange('contactNumber2', e);
                        trigger("contactNumber2");
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Número telefónico secundario (opcional)"
                    />
                  </div>
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Redes sociales (opcional)"
              htmlFor="socialWhatsapp"
              error={
                errors.socialWhatsapp && errors.socialWhatsapp.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.socialWhatsapp && errors.socialWhatsapp.type === "pattern" ? (
                  <span>¡Formato de red social no valido!</span>
                ) : null
              }
            >
              <Controller
                name="socialWhatsapp"
                defaultValue={state && state.data2 && state.data2.socialWhatsapp ? state.data2.socialWhatsapp : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^\d{10}$/ // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IoLogoWhatsapp style={{ "fill": "#21b639", "width": "28px", "height": "28px" }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input
                      rows={5}
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                        handleOnChange('socialWhatsapp', e);
                        trigger("socialWhatsapp");
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="WhatsApp"
                    />
                  </div>
                )}
              />
            </FormControl>
            <FormControl

              htmlFor="socialTwitter"
              error={
                errors.socialTwitter && errors.socialTwitter.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.socialTwitter && errors.socialTwitter.type === "pattern" ? (
                  <span>¡Formato de red social no valido!</span>
                ) : null
              }
            >
              <Controller
                name="socialTwitter"
                defaultValue={state && state.data2 && state.data2.socialTwitter ? state.data2.socialTwitter : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^(?:https:\/\/)(?:www\.)?twitter\.com\/([a-zA-Z0-9_]){1,255}[\/]{0,1}$|^$/ // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IoLogoTwitter style={{ "fill": "#55ADEE", "width": "28px", "height": "28px" }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input
                      rows={5}
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                        handleOnChange('socialTwitter', e);
                        trigger("socialTwitter");
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Twitter"
                    />
                  </div>
                )}
              />
            </FormControl>
            <FormControl

              htmlFor="socialFacebook"
              error={
                errors.socialFacebook && errors.socialFacebook.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.socialFacebook && errors.csocialFacebook.type === "pattern" ? (
                  <span>¡El teléfono debe tener 10 dígitos numéricos!</span>
                ) : null
              }
            >
              <Controller
                name="socialFacebook"
                defaultValue={state && state.data2 && state.data2.socialFacebook ? state.data2.socialFacebook : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^(?:https:\/\/)(?:www\.)?facebook\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$|^$/ // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IoLogoFacebook style={{ "fill": "#3b5998", "width": "28px", "height": "28px" }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input
                      rows={5}
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                        handleOnChange('socialFacebook', e);
                        trigger("socialFacebook");
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Facebook"
                    />
                  </div>
                )}
              />
            </FormControl>
            <FormControl

              htmlFor="socialInstagram"
              error={
                errors.socialInstagram && errors.socialInstagram.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.socialInstagram && errors.socialInstagram.type === "pattern" ? (
                  <span>¡El teléfono debe tener 10 dígitos numéricos!</span>
                ) : null
              }
            >
              <Controller
                name="socialInstagram"
                defaultValue={state && state.data2 && state.data2.socialInstagram ? state.data2.socialInstagram : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^(?:https:\/\/)(?:www\.)?instagram\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$|^$/ // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IoLogoInstagram style={{ "fill": "#e4405f", "width": "28px", "height": "28px" }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input
                      rows={5}
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                        handleOnChange('socialInstagram', e);
                        trigger("socialInstagram");
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Instagram"
                    />
                  </div>
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Página web (opcional)"
              htmlFor="webpage"
              error={
                errors.webpage && errors.webpage.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.webpage && errors.webpage.type === "pattern" ? (
                  <span>¡Formato de página web no valido!</span>
                ) : null
              }
            >
              <Controller
                name="webpage"
                defaultValue={state && state.data2 && state.data2.webpage ? state.data2.webpage : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^(https:\/\/)[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+(\/[a-zA-Z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~]*)?$/ // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AiOutlineLaptop style={{ "width": "28px", "height": "28px" }} />
                    <div style={{ margin: '4px' }}></div> {/* Esto es un espacio de blanco */}
                    <Input
                      rows={5}
                      onChange={(e) => { // Cuando el usuario cambia el valor del campo
                        onChange(e);
                        handleOnChange('webpage', e);
                        trigger("webpage");
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Ejemplo: https://funservir.vercel.app"
                    />
                  </div>
                )}
              />
            </FormControl>
          </Col>
        </Row>
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
            Siguiente
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default AccountDetails;
