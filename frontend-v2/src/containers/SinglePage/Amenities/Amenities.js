import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'components/UI/Heading/Heading';
import TextLink from 'components/UI/TextLink/TextLink';
import { FaWifi, FaCarAlt, FaWheelchair, FaBlind } from 'react-icons/fa';
import IconCard from 'components/IconCard/IconCard';
import AmenitiesWrapper, { AmenitiesArea } from './Amenities.style';
import { TextButton } from '../SinglePageView.style';
import { Element } from 'react-scroll';

const Amenities = ({ titleStyle, linkStyle }) => {
  return (
    <Element name="amenities" className="Amenities">
      <AmenitiesWrapper>
        <Heading as="h2" content="Elementos inclusivos" {...titleStyle} />
        <AmenitiesArea>
          <IconCard icon={<FaWifi />} title="Wifi" />
          <IconCard icon={<FaCarAlt />} title="Parqueadero para personas con discapacidad" />
          <IconCard icon={<FaWheelchair />} title="Accesible para personas en silla de ruedas" />
          <IconCard icon={<FaBlind />} title="Accesible para invidente" />
        </AmenitiesArea>
        {/* <TextButton>
          <TextLink link="#1" content="Show all amenities" {...linkStyle} />
        </TextButton> */}
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
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};

export default Amenities;
