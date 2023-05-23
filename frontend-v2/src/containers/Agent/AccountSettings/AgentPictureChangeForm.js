import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import ImageUploader from 'components/UI/ImageUploader/ImageUploader';
import Heading from 'components/UI/Heading/Heading';
import { AgentPictureUploader, FormTitle } from './AccountSettings.style';
import { AuthContext } from 'context/AuthProvider';

export default function AgentPictureChangeForm() {

  const { user } = useContext(AuthContext);

  const [coverPicture, setCoverPicture] = useState([]);
  const [profilePicture, setProfilePicture] = useState([]);

  useEffect(() => {
    const initializeImages = () => {
      if (user.coverPicture) {
        setCoverPicture([
          {
            status: 'done',
            url: user.coverPicture,
          },
        ]);
      }

      if (user.profilePicture) {
        setProfilePicture([
          {
            status: 'done',
            url: user.profilePicture,
          },
        ]);
      }
    };

    initializeImages();
  }, [user]);

  return (
    <AgentPictureUploader>
      <FormTitle>Imágenes de perfil</FormTitle>
      <Heading content="Imagen de portada" as="h4" />
      <ImageUploader fileList={coverPicture} />
      <Divider />
      <Heading content="Imagen de perfil" as="h4" />
      <ImageUploader fileList={profilePicture} />

      <div className="submit-container">
        <Button htmlType="submit" type="primary">
          Guardar cambios
        </Button>
      </div>
    </AgentPictureUploader>
  );
}