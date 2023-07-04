import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'components/UI/Heading/Heading';
import TextLink from 'components/UI/TextLink/TextLink';
import { FaWifi, FaCarAlt, FaWheelchair, FaBlind } from 'react-icons/fa';
import IconCard from 'components/IconCard/IconCard';
import AmenitiesWrapper, { AmenitiesArea } from './Amenities.style';
import MoreAboutInclusivityWrapper from './MoreAboutInclusivity.style';
import Text from 'components/UI/Text/Text';
import { TextButton } from '../SinglePageView.style';
import { Element } from 'react-scroll';
import { Row, Col, Button } from 'antd';

const Amenities = ({ titleStyle, titleStyle2, linkStyle, contentStyle }) => {
  return (
    <Element name="inclusividad" className="inclusividad">
      <AmenitiesWrapper>
        <Heading as="h2" content="Elementos inclusivos: 8" {...titleStyle} />
        {/* <Row gutter={[16, 24]}>
          <Col span={8} key={"hola"}>
            <img
              className="inclusive_icon"
              src="https://res.cloudinary.com/pasantiafunservir/image/upload/v1686071873/inclusiveElements/Estacionamiento%20para%20personas%20con%20movilidad%20reducida.png"
              alt="Listing details page banner"
            />
            <p>
              hola
            </p>
          </Col>
          <Col span={8} key={"hola"}>
            <img
              className="third-image"
              src="https://res.cloudinary.com/pasantiafunservir/image/upload/v1686071873/inclusiveElements/Estacionamiento%20para%20personas%20con%20movilidad%20reducida.png"
              alt="Listing details page banner"
            />
            <p>
              {"hola"}
            </p>
          </Col>
          <Col span={8} key={"hola"}>
            <img
              className="third-image"
              src="https://res.cloudinary.com/pasantiafunservir/image/upload/v1686071873/inclusiveElements/Estacionamiento%20para%20personas%20con%20movilidad%20reducida.png"
              alt="Listing details page banner"
            />
            <p>
              {"hola"}
            </p>
          </Col>
          <Col span={8} key={"hola"}>
            <img
              className="third-image"
              src="https://res.cloudinary.com/pasantiafunservir/image/upload/v1686071873/inclusiveElements/Estacionamiento%20para%20personas%20con%20movilidad%20reducida.png"
              alt="Listing details page banner"
            />
            <p>
              {"hola"}
            </p>
          </Col>
          <Col span={8} key={"hola"}>
            <img
              className="third-image"
              src="https://res.cloudinary.com/pasantiafunservir/image/upload/v1686071873/inclusiveElements/Estacionamiento%20para%20personas%20con%20movilidad%20reducida.png"
              alt="Listing details page banner"
            />
            <p>
              {"hola"}
            </p>
          </Col>
        </Row> */}
        <AmenitiesArea>
          <IconCard icon={<FaWifi />} title="Wifi" />
          <IconCard icon={<FaCarAlt />} title="Parqueadero para personas con discapacidad" />
          <IconCard icon={<FaWheelchair />} title="Accesible para personas en silla de ruedas" />
          <IconCard icon={<FaBlind />} title="Accesible para invidente" />
          <IconCard icon={<FaBlind />} title="Accesible para invidente" />
          <IconCard icon={<FaWifi />} title="Wifi" />
          <IconCard icon={<FaCarAlt />} title="Parqueadero para personas con discapacidad" />
          <IconCard icon={<FaWheelchair />} title="Accesible para personas en silla de ruedas" />
        </AmenitiesArea>
        <TextButton>
          {/* <TextLink link="#1" content="Mostrar todos los elementos" {...linkStyle} /> */}
          <Button onClick={console.log("más")} style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#008489',
            border: '1px solid',
            borderColor: '#E6E6E6', /* Replace "red" with the desired color */
          }}>
            {"Mostrar todos los elementos"}
          </Button>
        </TextButton>
        <MoreAboutInclusivityWrapper>
          <Heading as="h2" content="Información adicional sobre inclusividad" {...titleStyle2} />
          <Text
            content={"Queda a 5 minutos a pie desde la estación Usaquen. El barrio es tranquilo y perfecto para disfrutar del auténtico sabor de la vida romana, con tiendas, galerías de arte, restaurantes, bares y discotecas, todo cerca y listo para ser descubierto."}
            {...contentStyle}
          />
        </MoreAboutInclusivityWrapper>
      </AmenitiesWrapper>
    </Element>
  );
};

Amenities.propTypes = {
  titleStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

Amenities.defaultProps = {
  titleStyle: {
    color: '#2C2C2C',
    fontSize: ['17px', '20px', '25px'],
    lineHeight: ['1.15', '1.2', '1.36'],
    mb: ['14px', '20px', '30px'],
  },
  titleStyle2: {
    color: '#2C2C2C',
    fontSize: ['17px', '20px', '25px'],
    lineHeight: ['1.15', '1.2', '1.36'],
    mb: ['4px', '20px'],
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
    borderColor: 'red', /* Replace "red" with the desired color */
    // border: '0',
  },
};

export default Amenities;
