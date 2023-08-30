import React, {useEffect} from 'react';
import Image from 'components/UI/Image/Image';
import TextLink from 'components/UI/TextLink/TextLink';
import EmailConfirmedWrapper, { ContentWrapper } from './emailConfirmed.style';
import { useLocation } from 'react-router-dom';
import axios from "../../settings/axiosConfig";

const EmailConfirmed = ({ staticContext = {} }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get('token');
  const email = queryParams.get('email');
  const expires = queryParams.get('expires');
  useEffect(() => {
    const validate = async () => {
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/confirmEmailToken`, { token, email, expires });
      if(!res){
        staticContext.status = 404;
      }
    }

    try {
      validate();
      
    } catch (error) {

    }
  })


  return (
    <EmailConfirmedWrapper>
      <ContentWrapper>
        <Image src="/images/confirmed.png" alt="email confirmado" />
        <TextLink link="/" content="Volver" />
      </ContentWrapper>
    </EmailConfirmedWrapper>
  );
};

export default EmailConfirmed;
