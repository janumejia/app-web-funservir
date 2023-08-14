import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import LocationWrapper from './Location.style';
import Map from 'components/Map/Map';
import { Element } from 'react-scroll';
import { Link } from 'react-router-dom';

const Location = ({
  // titleStyle,
  locationMetaStyle,
  contentStyle,
  boldContentStyle,
  linkStyle,
  location,
}) => {
  const titleStyle = {
    fontSize: '25px',
    // mb: ['14px', '20px', '14px']
  }
  return (
    <Element name="ubicacion" className="ubicacion">
      <LocationWrapper>
        <Heading as="h2" content="Ubicación" {...titleStyle} />
        <Text
          content={
            <>
              <p style={{ "margin": "3px 0 5px 0" }}>
                {location.siteAddress + ", " + location.neighborhood + ", " + location.locality}
              </p>
              <Link to={`http://www.google.com/maps/place/${location.location.lat},${location.location.lng}`} target="_blank">
                {"Abrir en Google Maps"}
              </Link>
            </>
          }
          {...locationMetaStyle}
        />
        {/* <Text
          content="Queda a 5 minutos a pie desde la estación Usaquen. El barrio es tranquilo y perfecto para disfrutar del auténtico sabor de la vida romana, con tiendas, galerías de arte, restaurantes, bares y discotecas, todo cerca y listo para ser descubierto."
          {...contentStyle}
        />
        <Text
          content="Distancia desde el aeropuerto el Dorado"
          {...contentStyle}
          {...boldContentStyle}
        />
        <Text content="26 minutos en carro en promedio" {...contentStyle} /> */}

        <Map location={location} multiple={false} />
      </LocationWrapper>
    </Element>
  );
};

Location.propTypes = {
  titleStyle: PropTypes.object,
  locationMetaStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

Location.defaultProps = {
  titleStyle: {
    color: '#2C2C2C',
    fontSize: ['17px', '20px', '25px'],
    lineHeight: ['1.15', '1.2', '1.36'],
    mb: '4px',
  },
  locationMetaStyle: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#909090',
    mb: ['14px', '20px', '27px'],
  },
  contentStyle: {
    fontSize: '15px',
    fontWeight: '400',
    color: '#2C2C2C',
    lineHeight: '1.6',
    mb: ['14px', '20px', '27px'],
  },
  boldContentStyle: {
    fontWeight: '700',
    mb: '0!important',
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};

export default Location;
