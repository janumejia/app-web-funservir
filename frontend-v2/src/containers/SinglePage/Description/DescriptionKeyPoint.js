import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';
import Rating from 'components/UI/Rating/Rating';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import { Button, Tag } from 'antd';
import DescriptionWrapper from './Description.style';
import { RatingMeta, TextButton } from '../SinglePageView.style';
import { Divider, } from 'antd';

const colors = [
  { name: 'Red', color: '#FF3838' },
  { name: 'Orange', color: '#f90' },
  { name: 'Lime', color: '#a0d911' },
  { name: 'Green', color: '#52c41a' },
  { name: 'Cyan', color: '#13c2c2' },
  { name: 'Blue', color: '#1890ff' },
  { name: 'Geekblue', color: '#2f54eb' },
  { name: 'Purple', color: '#722ed1' },
  { name: 'Magenta', color: '#eb2f96' },
  { name: 'Volcano', color: '#fa541c' },
  { name: 'Gold', color: '#faad14' },
  { name: 'Limegreen', color: '#7cb305' },
  { name: 'Cyanblue', color: '#0097fb' },
];

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index].color;
}

const Description = ({
  title,
  formattedAddress,
  description,
  rating,
  ratingCount,
  classification,
  categoryStyle,
  titleStyle,
  locationMetaStyle,
  contentStyle,
  imagesSection,
}) => {
  const [truncated, setTruncated] = useState(true);

  const handleToggle = () => {
    setTruncated(!truncated);
  };

  const truncatedContent = truncated ? description.slice(0, 500) + "... " : description + " ";

  return (
    <Element name="general" className="general">
      <DescriptionWrapper>
        <Text content={formattedAddress} {...locationMetaStyle} />
        <Heading as="h2" content={title} {...titleStyle} />
        {/* {rating && ratingCount
          ? (
            <RatingMeta>
              <Rating rating={rating} ratingCount={ratingCount} type="bulk" />
            </RatingMeta>
          ) : <Text content={"Sin calificaciones"} />
        } */}
        <Text content={
          <>
            <Tag className="tag-class" color={classification === "inclusiveElement" ? "#52c41a" : "#FA8C16"} style={{ fontSize: '16px' }}>
              {classification === "inclusiveElement" ? "Elemento inclusivo" : "Barrera arquitectónica"}
            </Tag>
          </>
        }
          style={{
            fontSize: "18px",
            padding: "0px 0px 0px 0px",
            margin: "4px 0 0 -5px"
          }}
        />
        {/* <Divider className="divider-class-keypoint" /> */}
        <div style={{ "margin": "60px 0 0 0" }} />
        {imagesSection && imagesSection}
        <div style={{ "margin": "20px 0 0 0" }}>
          <Text content={
            <>
              {description && description.length > 0 ?
                <>
                  <div style={{ "font-weight": "bold" }}>Descripción:</div>
                  {description.length > 500 ? truncatedContent : description}
                  {description.length > 500 && (truncated ? <Button onClick={handleToggle}>{' leer más'}</Button> : <Button onClick={handleToggle}>{' leer menos'}</Button>)}
                </>
                :
                <>
                  <div style={{ "font-weight": "bold" }}>Descripción:</div>
                  Sin descripción
                </>
              }
            </>

          } {...contentStyle} />
        </div>
      </DescriptionWrapper>
    </Element>
  );
};

Description.propTypes = {
  titleStyle: PropTypes.object,
  locationMetaStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

Description.defaultProps = {
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
  },
  contentStyle: {
    fontSize: '15px',
    fontWeight: '400',
    color: '#2C2C2C',
    lineHeight: '1.6',
  },
};

export default Description;
