import { message, Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import Image from 'components/UI/Image/Image';
import TextLink from 'components/UI/TextLink/TextLink';
import EmailConfirmedWrapper, { ContentWrapper } from './emailConfirmed.style';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "../../settings/axiosConfig";

const EmailConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get('token');
  const email = queryParams.get('email');
  const expires = queryParams.get('expires');

  useEffect(() => {
    const validate = async () => {
      await axios.post(`${process.env.REACT_APP_HOST_BACK}/confirmEmailToken`, { token, email, expires }).then((res) => {
        if (res.data.message === "Error") {
          navigate(`/token=${token}&email=${email}&expires=${expires}`, { replace: true });
          message.error('El link ha expirado o es inválido');
        }
        setIsLoading(false);
      });
    }
    try {
      validate();
    } catch (error) {
      message.error('Ha ocurrido un error');
    }

  })


  return (
    (isLoading) ?
      <></>
      :
      (
        <EmailConfirmedWrapper>
          <ContentWrapper>
            <Image src="/images/confirmed.png" alt="email confirmado" />
            <TextLink link="/" content="Volver" />
          </ContentWrapper>
        </EmailConfirmedWrapper>
      )
  );
};

export default EmailConfirmed;
