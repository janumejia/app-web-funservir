import React, { useState } from 'react';
import PricingItems from './PricingItems';
import PricingWrapper, {
  PricingHeader,
  Title,
  SubTitle,
  Description,
  ButtonGroup,
  PricingTableArea,
  Button,
} from './Pricing.style';
// demo data
import { monthlyPlans, annuallyPlans } from './Pricing.data';
import Container from 'components/UI/Container/Container';
import Heading from 'components/UI/Heading/Heading';
import { Avatar, Divider, Popover } from 'antd';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const imgFunservir = 'https://res.cloudinary.com/pasantiafunservir/image/upload/v1697945796/ImagenesQuienesSomos/imagen-funservir.png';
const facebookLink = 'https://www.facebook.com/Funservir';
const linkedinLink = 'https://www.linkedin.com/company/fundaci-n-social-servir';
const imgBuyMeACoffee = 'https://res.cloudinary.com/pasantiafunservir/image/upload/v1698012742/ImagenesQuienesSomos/buy-me-a-coffee_go2vqz.png';
const linkBuyMeACoffee = 'https://www.buymeacoffee.com/funservircol'

const Pricing = () => {
  const [currentPlan, setCurrentPlan] = useState('monthly');
  let plans = [];
  if (currentPlan === 'monthly') {
    plans = monthlyPlans;
  }
  if (currentPlan === 'annually') {
    plans = annuallyPlans;
  }

  return (
    <PricingWrapper>
      <PricingHeader>
        <Title>¿Quiénes Somos?</Title>
        <Divider />
        {/* <SubTitle>Fundación Social Servir (Funservir)</SubTitle> */}
        <div style={{ textAlign: 'center', lineHeight: '64px', margin: '10px 0 30px 0' }}>
          <img
            src={imgFunservir}
            style={{ width: '25%' }}
            alt=''
          />
        </div>
        <Description>
          La aplicación <strong>App Colombia Accesible</strong> es una iniciativa de la
          Fundación Social Servir (Funservir). Funservir es una organización
          que cubre más del 50 por ciento del territorio nacional y se dedica
          a brindar acompañamiento en diferentes campos de la salud a personas
          diagnosticadas con enfermedades crónicas, huérfanas y de alto costo.
          Su labor está enfocada en la atención de pacientes con patologías
          como Fabry, Gaucher, Angioedema Hereditario, Hemofilia, Hunter, y
          otras condiciones médicas que requieren un cuidado especializado.
        </Description>
        <Divider />
        <SubTitle>Desarrolladores</SubTitle>
        <Description>
          Esta aplicación fue creada por dos estudiantes apasionados
          de la Universidad Autónoma de Occidente en
          Cali, Colombia. Estos jóvenes talentosos se han comprometido a mejorar
          la calidad de vida de las personas con discapacidad y han trabajado
          incansablemente en la creación de esta herramienta.
        </Description>
      </PricingHeader>
      <PricingTableArea>
        <PricingItems plans={plans} />
      </PricingTableArea>
      <Divider />
      <SubTitle>Apoya el proyecto</SubTitle>
      <Description>
        Gracias por tu interés en apoyar nuestro proyecto. Tu generosidad contribuye
        al desarrollo continuo y al sostenimiento de nuestra aplicación web que busca
        hacer del mundo un lugar más accesible para todos.
        <br /><br />
        Si encuentras valor en nuestra plataforma y deseas hacer una donación para
        ayudarnos a seguir mejorando, te damos la bienvenida a contribuir a través de
        "Buy Me a Coffee." Tu apoyo es fundamental para que podamos continuar ofreciendo
        soluciones inclusivas y de calidad.
      </Description>
      <Description>
        <div style={{ textAlign: 'center' }}>
          <a href={linkBuyMeACoffee} target="_blank" rel="noopener noreferrer">
            <img
              src={imgBuyMeACoffee}
              alt=''
              width={"25%"}
            />
          </a>
        </div>
        <br /><br />
        Cada taza de café que compres nos permite mantener esta iniciativa en funcionamiento.
        ¡Gracias por ser parte de nuestro viaje y por tu apoyo continuo!
      </Description>
      <Divider />
      <SubTitle>Contacto</SubTitle>
      <Description>
        Si tienes alguna pregunta, sugerencia o comentario sobre esta aplicación, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte y mejorar nuestra plataforma.
      </Description>
      <Description>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MdEmail className="email" style={{ marginRight: '10px' }} />
          <span>
            Correo Electrónico de Soporte: <strong>appcolombiaaccesible@gmail.com</strong>
          </span>
        </div>
      </Description>

      <Description>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaFacebookSquare className="facebook" style={{ marginRight: '10px', color: '#0866ff' }} />
          <span>
            Facebook: <strong><a href={facebookLink} target="_blank" style={{ color: '#399C9F' }}>{facebookLink}</a></strong>
          </span>
        </div>
      </Description>

      <Description>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaLinkedin className="linkedin" style={{ marginRight: '10px', color: '#0a66c2' }} />
          <span>
            LinkedIn: <strong><a href={linkedinLink} target="_blank" style={{ color: '#399C9F' }}>{linkedinLink}</a></strong>
          </span>
        </div>
      </Description>

    </PricingWrapper>
  );
};

export default Pricing;
