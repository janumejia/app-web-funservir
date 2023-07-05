import React, { useEffect, useState } from 'react';
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

const Amenities = ({ titleStyle, titleStyle2, linkStyle, contentStyle, inclusiveElements, moreInfoInclusivity }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [seeMore, setSeeMore] = useState(false)

  let firstElements = windowDimensions.width > 766 ? 8 : (windowDimensions.width > 580 ? 6 : 4);

  return (
    <Element name="inclusividad" className="inclusividad">
      <AmenitiesWrapper>
        <Heading as="h2" content={"Elementos inclusivos: " + (inclusiveElements ? inclusiveElements.length : "0")} {...titleStyle} />
        <AmenitiesArea>
          {inclusiveElements.slice(0, seeMore === false ? firstElements : inclusiveElements.length).map((element) => {
            return <IconCard icon={element.image.secure_url} title={element.name} />
          })}
        </AmenitiesArea>
        {firstElements < inclusiveElements.length &&
          <TextButton>
            {/* <TextLink link="#1" content="Mostrar todos los elementos" {...linkStyle} /> */}
            <Button onClick={() => setSeeMore(!seeMore)} style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#008489',
              border: '1px solid',
              borderColor: '#E6E6E6', /* Replace "red" with the desired color */
            }}>
              {seeMore ? "- Mostrar menos elementos" : "+ Mostrar todos los elementos"}
            </Button>
          </TextButton>
        }
        <MoreAboutInclusivityWrapper>
          <Heading as="h2" content="Información adicional sobre inclusividad" {...titleStyle2} />
          <Text
            content={moreInfoInclusivity}
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
