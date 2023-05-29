import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, message } from 'antd';
import { useForm } from 'react-hook-form';
import ImageUploader from 'components/UI/ImageUploader/ImageUploader';
import Heading from 'components/UI/Heading/Heading';
import { AgentPictureUploader, FormTitle } from './AccountSettings.style';
import { AuthContext } from 'context/AuthProvider';
import axios from "../../../settings/axiosConfig"; // Para la petición de registro

export default function AgentPictureChangeForm() {

  const { user, setUser } = useContext(AuthContext);

  const [coverPicture, setCoverPicture] = useState([]);
  const [profilePicture, setProfilePicture] = useState([]);

  const {
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const initializeImages = () => {
      if (user && user.coverPicture) {
        setCoverPicture([
          {
            status: 'done',
            url: user.coverPicture,
          },
        ]);
      }

      if (user && user.profilePicture) {
        setProfilePicture([
          {
            status: 'done',
            url: user.profilePicture,
          },
        ]);
      }
    };

    console.log(user)
    console.log(coverPicture)
    console.log(profilePicture)
    initializeImages();
  }, [user]);

  const onSubmit = async () => {
    console.log(user)
    console.log(coverPicture)
    console.log(profilePicture)
    if (coverPicture[0] && coverPicture[0].url && profilePicture[0] && profilePicture[0].url) message.warning("Debes modificar alguna de las imágenes primero", 3);
    else {

      let data = {}
      if (coverPicture[0] && coverPicture[0].thumbUrl) data["coverPicture"] = coverPicture[0].thumbUrl // Se modifico la imagen que ya tenia
      else if (coverPicture[0] && coverPicture[0].url) data["coverPicture"] = coverPicture[0].url // NO se modifico la imagen que ya tenia
      else data["coverPicture"] = "" // Se quitó o no tenia una imagen

      if (profilePicture[0] && profilePicture[0].thumbUrl) data["profilePicture"] = profilePicture[0].thumbUrl
      else if (profilePicture[0] && profilePicture[0].url) data["profilePicture"] = profilePicture[0].url // NO se modifico la imagen que ya tenia
      else data["profilePicture"] = "" // Se quitó o no tenia una imagen

      try {
        message.loading("Cargando", 0);
        const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/changePictures`, data);
        message.destroy();
        if (res) {
          if (res.status === 200) {
            message.success(res.data.message, 3);
  
            let updatedUser = { // Poner los valores que tiene actualmente el usuario y agregar los que nos llega del back
              ...user,
              ...res.data.data
            }
            setUser(updatedUser);
  
          } else message.warning("Respuesta del servidor desconocida", 3);
        }
      } catch (error) {
        message.destroy();
        if (!error.response || (error.response && typeof error.response.status === 'undefined')) {
  
          message.warning({ content: "Error de conectividad con el servidor", duration: 3 });
        } else {
          if (error.response.status >= 400 && error.response.status <= 499) { // Errores del cliente
  
            message.warning({ content: error.response.data.message, duration: 3 });
          }
          else if (error.response.status >= 500 && error.response.status <= 599) {
  
            message.error({ content: error.response.data.message, duration: 3 });
          } // Errores del servidor
          else {
            message.warning({ content: "Error de conectividad con el servidor", duration: 3 });
          }
        }
      }

    }
  }

  return (
    <AgentPictureUploader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Imágenes de perfil</FormTitle>
        <Heading content="Imagen de portada" as="h4" />
        <ImageUploader fileList={coverPicture} setImage={setCoverPicture} />
        <Divider />
        <Heading content="Imagen de perfil" as="h4" />
        <ImageUploader fileList={profilePicture} setImage={setProfilePicture} />

        <div className="submit-container">
          <Button htmlType="submit" type="primary">
            Guardar cambios
          </Button>
        </div>
      </form>
    </AgentPictureUploader>
  );
}