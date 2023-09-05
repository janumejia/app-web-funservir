import React, { useContext, useState, useEffect } from 'react';
import Image from 'components/UI/Image/Image';
import TextLink from 'components/UI/TextLink/TextLink';
import EmailConfirmedWrapper, { ContentWrapper } from './emailNotConfirmed.style';
import Heading from 'components/UI/Heading/Heading';
import { AuthContext } from 'context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Text } from 'containers/Auth/Auth.style';
const EmailNotConfirmed = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (Object.keys(user).length !== 0) {
      if (user.emailConfirmed) {
        navigate("/");
      } else {
        setIsLoading(false);
      }
    } else {
      navigate("/");
    }
  }, [navigate, user])

  return (
    (isLoading) ?
      <></>
      :
      (
        <EmailConfirmedWrapper>
          <ContentWrapper>
            <Image src="/images/not-confirmed.png" alt="People illustrations by Storyset" />
            <Heading as="h2" content="Parece que aún no has confirmado tu correo electrónico" />
            <Text style={{ marginBottom: '0px' }}>{`Por favor verifique la bandeja de entrada del correo ${user.email}`}</Text>
            <Text style={{ marginTop: '0px', lineHeight: '0' }}>{`para confirmar y finalizar su registro.`}</Text>
            <TextLink link="/" content="Volver" />
          </ContentWrapper>
        </EmailConfirmedWrapper>
      )
  );
};

export default EmailNotConfirmed;
