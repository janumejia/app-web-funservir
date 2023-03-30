import { useStateMachine } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { useForm, Controller } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { Row, Col, Input, Button, Select } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import addDataAction from './AddOwnerAction';
import { FormHeader, Title, Description, FormContent, FormAction } from './AddOwner.style';
const { Option } = Select;

const AccountDetails = ({ setStep }) => {
  const { actions, state } = useStateMachine({ addDataAction }); // Usamos el estado global de StateMachine

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    trigger, // Lo importamos para validar que la entrada del usuario se cumpla mientras se está editando
  } = useForm({
    defaultValues: { // Valores por defecto del formularios
      siteName: state?.data?.sitesitesiteName,
      locationDescription: state?.data?.locationDescription,
      phoneNumber: state?.data?.phoneNumber,
      category: state?.data?.category,
      inclusiveElements: state?.data?.inclusiveElements
    },
  });

  const handleOnChange = (key, event) => {
    actions.addDataAction({ [key]: event.target.value });
    setValue(key, event.target.value);
  };

  console.log("state:", state)

  const onSubmit = (data) => {
    actions.addDataAction(data); // Guardar la información ingresada en el estado de StateMachine
    setStep(4); // Pasar a la siguiente página de registro
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContent>
        <FormHeader>
          <Title>Paso 3 de 5: Datos del sitios de interes</Title>
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
            ) : errors.siteName && errors.siteName.type === "pattern" ? (
              <span>¡El nombre está en un formato no válido!</span>
            ) : null
          }
        >
          <Controller
            name="siteName"
            defaultValue={state?.data?.siteName}
            control={control}
            rules={{
              required: true,
              pattern: /^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
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
                placeholder="Escribe tu nombre"
              />
            )}
          />
        </FormControl>

        <FormControl
          label="Descripción"
          htmlFor="locationDescription"
          error={
            errors.locationDescription && <span>¡Este campo es requerido!</span>
          }
        >
          <Controller
            name="locationDescription"
            defaultValue={state?.data?.locationDescription}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input.TextArea
                rows={5}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Escribe una descripción de tu hotel, puede ayudar a los viajeros a darse una idea de lo que se pueden encontrar en tu lugar."
              />
            )}
          />
        </FormControl>

        <Row gutter={30}>
          <Col sm={12}>
            <FormControl
              label="Número telefónico"
              htmlFor="phoneNumber"
              error={
                errors.phoneNumber && errors.phoneNumber.type === "required" ? (
                  <span>¡Este campo es requerido!</span>
                ) : null
              }
            >
              <Controller
                name="phoneNumber"
                defaultValue={state?.data?.phoneNumber}
                control={control}
                rules={{
                  required: true,
                  //pattern: /^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/, // // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    rows={5}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Escribe tu número telefónico"
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col sm={12}>
            <FormControl
              label="Categoria"
              htmlFor="category"
            >
              <Controller
                name="category"
                defaultValue={state?.data?.category}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select defaultValue="CategoriaDummy1">
                    <Option value="CategoriaDummy1">Categoria Dummy1</Option>
                    <Option value="CategoriaDummy2">Categoria Dummy2</Option>
                  </Select>
                )}
              />
            </FormControl>
          </Col>
        </Row>
        <FormControl
          label="Elementos inclusivos"
          htmlFor="inclusiveElements"
        >
          <Controller
            name="inclusiveElements"
            defaultValue={state?.data?.inclusiveElements}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                mode="multiple"
                style={{
                  width: '100%',
                }}
                placeholder="Seleccione una opción"
                allowClear={true}
              >
                <Option value="Caminador">Caminador</Option>
                <Option value="Silla de ruedas">Silla de ruedas</Option>
              </Select>
            )}
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
            Siguiente
          </Button>
        </div>
      </FormAction>
    </form>
  );
};

export default AccountDetails;
