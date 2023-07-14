import { useStateMachine } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Button, Select } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import EditDataAction from './EditListingAction';
import { FormHeader, Title, Description, FormContent, FormAction, ColombiaFlag } from './EditListing.style';
import axios from "../../settings/axiosConfig"; // Para la petición de registro



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

        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Número telefónico"
              htmlFor="contactNumber"
              error={
                errors.contactNumber && errors.contactNumber.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : errors.contactNumber && errors.contactNumber.type === "pattern" ? (
                  <span>¡El número está en un formato no válido!</span>
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
                      placeholder="Escribe tu número telefónico aquí"
                    />
                  </div>
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Categoria"
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    onChange={(e) => { // Cuando el usuario cambia el valor del campo
                      onChange(e);
                      handleOnChange('category', e);
                    }}
                    value={value}
                  >
                    {availableCategories.map(element => {
                      return (
                        <Select.Option key={element.name} value={element.name}>{element.name}</Select.Option>
                      )
                    })}
                  </Select>
                )}
              />
            </FormControl>
          </Col>
        </Row>
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
            defaultValue={state && state.dataEditSite && state.dataEditSite.inclusiveElements ? state.dataEditSite.inclusiveElements : []}
            control={control}
            // rules={{
            //   required: true,
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                mode="multiple"
                style={{
                  width: '100%',
                }}
                placeholder="Seleccione una o varias opciones"
                allowClear={true}
                onChange={(e) => { // Cuando el usuario cambia el valor del campo
                  onChange(e);
                  handleOnChange('inclusiveElements', e);
                }}
                value={value}
              >
                {availableElements.map(element => {
                  return (
                    <Select.Option key={element.name} value={element._id}>{element.name}</Select.Option>
                  )
                })}
              </Select>
            )}
          />
        </FormControl>
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
