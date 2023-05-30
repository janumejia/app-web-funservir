import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, message } from 'antd';
import { useForm } from 'react-hook-form';
import ImageUploader from 'components/UI/ImageUploader/ImageUploader';
import Heading from 'components/UI/Heading/Heading';
import { AgentPictureUploader, FormTitle } from './AccountSettings.style';
import { AuthContext } from 'context/AuthProvider';
import axios from "../../../settings/axiosConfig"; // Para la petición de registro
import DragAndDropUploader from "../../../components/UI/ImageUploader/DragAndDropUploader"

let aux1 = [];
let aux2 = [];

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

  useEffect(() => {
    const coverPictureToBase64 = async () => {
      const imgsCloudinary1 = await Promise.all(
        coverPicture?.map((img) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(img.originFileObj);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        })
      );

      aux1 = imgsCloudinary1.filter(Boolean); // Eliminar cualquier valor indefinido/nulo
    }

    if (coverPicture && coverPicture.length > 0 && coverPicture[0].originFileObj) {
      coverPictureToBase64()
    }

  }, [coverPicture]);

  useEffect(() => {

    const profilePictureToBase64 = async () => {
      const imgsCloudinary2 = await Promise.all(
        profilePicture?.map((img) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(img.originFileObj);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        })
      );

      aux2 = imgsCloudinary2.filter(Boolean); // Eliminar cualquier valor indefinido/nulo
    }

    if (profilePicture && profilePicture.length > 0 && profilePicture[0].originFileObj) {
      profilePictureToBase64()
    }

  }, [profilePicture]);

  const onSubmit = async () => {
    console.log(user)
    console.log(coverPicture)
    console.log(profilePicture)
    if (coverPicture[0] && coverPicture[0].url && profilePicture[0] && profilePicture[0].url) message.warning("Debes modificar alguna de las imágenes primero", 3);
    else {

      let data = {}
      if (coverPicture[0] && coverPicture[0].originFileObj) data["coverPicture"] = aux1[0] // Se modifico la imagen que ya tenia
      else if (coverPicture[0] && coverPicture[0].url) data["coverPicture"] = coverPicture[0].url // NO se modifico la imagen que ya tenia
      else data["coverPicture"] = "" // Se quitó o no tenia una imagen

      if (profilePicture[0] && profilePicture[0].originFileObj) data["profilePicture"] = aux2[0]
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
        <Heading content="Banner de perfil" as="h4" />
        <ImageUploader fileList={coverPicture} setImage={setCoverPicture} />
        {/* <DragAndDropUploader
            name="sitePhotos"
            value={coverPicture}
            onUploadChange={(dataAddSite) => {
              console.log(dataAddSite)
              setCoverPicture(dataAddSite.originFileObj)
            }}
          /> */}
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