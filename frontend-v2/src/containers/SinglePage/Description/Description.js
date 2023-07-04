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
  location,
  content,
  rating,
  ratingCount,
  category,
  categoryStyle,
  titleStyle,
  locationMetaStyle,
  contentStyle,
}) => {
  const [truncated, setTruncated] = useState(true);

  const handleToggle = () => {
    setTruncated(!truncated);
  };

  const truncatedContent = truncated ? content.slice(0, 380) + "... " : content;

  return (
    <Element name="general" className="general">
      <DescriptionWrapper>
        <Text content={location.formattedAddress} {...locationMetaStyle} />
        <Heading as="h2" content={title} {...titleStyle} />
        <RatingMeta>
          <Rating rating={rating} ratingCount={ratingCount} type="bulk" />
        </RatingMeta>
        <Divider className="divider-class" />
        <Text content={
          <>
            {"Categoría:"}
            <Tag className="tag-class" color={stringToColor(category)}>
              {category}
            </Tag>
          </>
        } {...categoryStyle} />
        <Text content={
          <>
            {truncatedContent}
            {truncated && <Button onClick={handleToggle}>{' leer más'}</Button>}
          </>

        } {...contentStyle} />
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
