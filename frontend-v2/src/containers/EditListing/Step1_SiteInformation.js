import { useStateMachine } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Button, Select, Tooltip } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import EditDataAction from './EditListingAction';
import { FormHeader, Title, Description, FormContent, FormAction, ColombiaFlag } from './EditListing.style';
import axios from "../../settings/axiosConfig"; // Para la petición de registro
import {
  IoLogoWhatsapp,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
} from 'react-icons/io';
import { AiOutlineLaptop } from "react-icons/ai";
import { BsFillInfoCircleFill } from 'react-icons/bs';

const infoInToolTip = {
  "inclusiveElements": "Los elementos inclusivos son características que un sitio puede ofrecer para facilitar el acceso a personas con discapacidades. Ejemplos de estos elementos incluyen rampas para sillas de ruedas, lenguaje en braille y pasamanos.",
}

const AccountDetails = ({ setStep, availableCategories, availableElements }) => {
  const { actions, state } = useStateMachine({ EditDataAction }); // Usamos el estado global de StateMachine

  const inclusiveSiteNameVerification = async (siteName) => {
    try {
      await axios.post(`${process.env.REACT_APP_HOST_BACK}/uniqueSiteNameValidator`, { siteName: siteName, _id: state.dataEditSite._id });
    } catch (error) {
      if (typeof error.response.status !== 'undefined' && error.response.status === 409) return false; // Invalido
    }
    return true; // Válido
  }

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    trigger, // Lo importamos para validar que la entrada del usuario se cumpla mientras se está editando
    watch,
  } = useForm({
    defaultValues: { // Valores por defecto del formularios
      siteName: state?.dataEditSite?.siteName,
      description: state?.dataEditSite?.description,
      contactNumber: state?.dataEditSite?.contactNumber,
      category: state?.dataEditSite?.category,
      inclusiveElements: state?.dataEditSite?.inclusiveElements
    },
  });

  const handleOnChange = (key, event) => {
    actions.EditDataAction({ [key]: (key === "category" || key === "inclusiveElements" ? event : event.target.value) });
    setValue(key, (key === "category" || key === "inclusiveElements" ? event : event.target.value));
  };

  // console.log("state:", state)
  const watchcontactNumber = watch("contactNumber", " "); // Valor por defecto es vacío

  const onSubmit = (dataEditSite) => {
    actions.EditDataAction(dataEditSite); // Guardar la información ingresada en el estado de StateMachine
    setStep(2); // Pasar a la siguiente página de registro
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 1 de 3: Datos del sitio de interés</Title>
          <Description>
            Actualiza los datos asociados a tu sitio.
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
            defaultValue={state?.dataEditSite?.siteName}
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
                placeholder="Escribe tu nombre aquí"
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
            defaultValue={state?.dataEditSite?.description}
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
            defaultValue={state?.dataEditSite?.category}
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
          label={
            <Tooltip placement="topLeft" color={'black'} overlayStyle={{ maxWidth: '400px', fontSize: '14px', fontWeight: '500' }} title={infoInToolTip.inclusiveElements}>
              <div style={{ display: 'inline', alignItems: 'center' }}>
                <span style={{ verticalAlign: 'middle' }}>Elementos inclusivos</span>
                <BsFillInfoCircleFill style={{ marginLeft: '5px', fontSize: '16px', verticalAlign: 'middle' }} />
              </div>
            </Tooltip>
          }
          htmlFor="inclusiveElements"
        // error={
        //   errors.inclusiveElements && errors.inclusiveElements.type === "required" ? (
        //     <span>¡Este campo es requerido!</span>
        //   ) : null
        // }
        >
          <Controller
            name="inclusiveElements"
            defaultValue={state && state.dataEditSite && state.dataEditSite.inclusiveElements ? state.dataEditSite.inclusiveElements : []}
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
        <FormControl
          label={
            <div>
              Más información sobre inclusividad del sitio
              <div style={{ marginLeft: '4px', display: 'inline', opacity: 0.5 }}>(opcional)</div>
            </div>
          }
          htmlFor="moreInfoInclusivity"
          error={
            errors.moreInfoInclusivity && errors.moreInfoInclusivity.type === "pattern" ? (
              <span>¡La información ingresada no está en un formato válido!</span>
            ) : null
          }
        >
          <Controller
            name="moreInfoInclusivity"
            defaultValue={state && state.dataEditSite && state.dataEditSite.moreInfoInclusivity ? state.dataEditSite.moreInfoInclusivity : ""}
            control={control}
            rules={{
              required: false,
              pattern: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){0,500}$/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input.TextArea
                rows={2}
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('moreInfoInclusivity', e);
                  trigger("moreInfoInclusivity");
                }}
                onBlur={onBlur}
                value={value}
                placeholder="Proporciona más detalles acerca de la inclusividad que ofrece el sitio."
              />
            )}
          />
        </FormControl>
        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Teléfono principal"
              htmlFor="contactNumber"
              error={
                errors.contactNumber && errors.contactNumber.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.contactNumber && errors.contactNumber.type === "pattern" ? (
                  <span>¡El teléfono debe tener 10 dígitos!</span>
                ) : null
              }
            >
              <Controller
                name="contactNumber"
                defaultValue={state?.dataEditSite?.contactNumber}
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
              label={
                <div>
                  Teléfono secundario
                  <div style={{ marginLeft: '4px', display: 'inline', opacity: 0.5 }}>(opcional)</div>
                </div>
              }
              htmlFor="contactNumber2"
              error={
                errors.contactNumber2 && errors.contactNumber2.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.contactNumber2 && errors.contactNumber2.type === "pattern" ? (
                  <span>¡El teléfono debe tener 10 dígitos!</span>
                ) : errors.contactNumber2 && errors.contactNumber2.type === "validate" ? (
                  <span>¡Los números telefónicos no deben ser iguales!</span>
                ) : null
              }
            >
              <Controller
                name="contactNumber2"
                defaultValue={state && state.dataEditSite && state.dataEditSite.contactNumber2 ? state.dataEditSite.contactNumber2 : ""}
                control={control}
                rules={{
                  required: false,
                  pattern: /^\d{10}$|^$/, // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                  validate: (value) =>
                    (value !== watchcontactNumber || watchcontactNumber === "") || false,
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
                      placeholder="Número telefónico secundario"
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
              label={
                <div>
                  Redes sociales
                  <div style={{ marginLeft: '4px', display: 'inline', opacity: 0.5 }}>(opcional)</div>
                </div>
              }
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
                defaultValue={state && state.dataEditSite && state.dataEditSite.socialWhatsapp ? state.dataEditSite.socialWhatsapp : ""}
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
                defaultValue={state && state.dataEditSite && state.dataEditSite.socialTwitter ? state.dataEditSite.socialTwitter : ""}
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
                ) : errors.socialFacebook && errors.socialFacebook.type === "pattern" ? (
                  <span>¡Formato de red social no valido!</span>
                ) : null
              }
            >
              <Controller
                name="socialFacebook"
                defaultValue={state && state.dataEditSite && state.dataEditSite.socialFacebook ? state.dataEditSite.socialFacebook : ""}
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
                  <span>¡Formato de red social no valido!</span>
                ) : null
              }
            >
              <Controller
                name="socialInstagram"
                defaultValue={state && state.dataEditSite && state.dataEditSite.socialInstagram ? state.dataEditSite.socialInstagram : ""}
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
              label={
                <div>
                  Página web
                  <div style={{ marginLeft: '4px', display: 'inline', opacity: 0.5 }}>(opcional)</div>
                </div>
              }
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
                defaultValue={state && state.dataEditSite && state.dataEditSite.webpage ? state.dataEditSite.webpage : ""}
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
          {/* <Button
            className="back-btn"
            htmlType="button"
            onClick={() => setStep(2)}
          >
            <IoIosArrowBack /> Volver
          </Button> */}
          <Button type="primary" htmlType="submit">
            Siguiente
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default AccountDetails;
