import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import MoreAboutInclusivityWrapper from './MoreAboutInclusivity.style';
import { Element } from 'react-scroll';

const MoreAboutInclusivity = ({
  content,
  titleStyle,
  contentStyle,
}) => {
  return (
    <Element name="inclusividad" className="inclusividad">
      <MoreAboutInclusivityWrapper>
        <Heading as="h2" content="Información adicional sobre inclusividad" {...titleStyle} />
        <Text
          content={"Queda a 5 minutos a pie desde la estación Usaquen. El barrio es tranquilo y perfecto para disfrutar del auténtico sabor de la vida romana, con tiendas, galerías de arte, restaurantes, bares y discotecas, todo cerca y listo para ser descubierto."}
          {...contentStyle}
        />
      </MoreAboutInclusivityWrapper>
    </Element>
  );
};

MoreAboutInclusivity.propTypes = {
  titleStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

MoreAboutInclusivity.defaultProps = {
  titleStyle: {
    color: '#2C2C2C',
    fontSize: ['17px', '20px', '25px'],
    lineHeight: ['1.15', '1.2', '1.36'],
    mb: '4px',
  },
  contentStyle: {
    fontSize: '15px',
    fontWeight: '400',
    color: '#2C2C2C',
    lineHeight: '1.6',
    mb: ['14px', '20px', '27px'],
  },
  // boldContentStyle: {
  //   fontWeight: '700',
  //   mb: '0!important',
  // },
  // linkStyle: {
  //   fontSize: '15px',
  //   fontWeight: '700',
  //   color: '#008489',
  // },
};

export default MoreAboutInclusivity;
