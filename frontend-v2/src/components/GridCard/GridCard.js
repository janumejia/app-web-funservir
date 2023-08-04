import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Tooltip } from 'antd';

import GridCardWrapper, {
  ImageWrapper,
  FavoriteIcon,
  FavoriteIconOriginal,
  ContentWrapper,
  LocationArea,
  TitleArea,
  RatingArea,
  MetaWrapper,
  ButtonGroup,
} from './GridCard.style';

const GridCard = ({
  className,
  inclusiveElements,
  favorite,
  location,
  title,
  rating,
  editBtn,
  viewDetailsBtn,
  children,
  myProfile,
  favoriteOriginal,
}) => {
  let classes = viewDetailsBtn || editBtn ? `has_btn ${className}` : className;
  return (
    <GridCardWrapper className={`grid_card ${classes}`.trim()}>
      <ImageWrapper className="media_wrapper">{children}</ImageWrapper>
      {myProfile && favorite ? <FavoriteIcon>{favorite}</FavoriteIcon>: (favoriteOriginal ? <FavoriteIconOriginal>{favoriteOriginal}</FavoriteIconOriginal> : <></>)}
      <ContentWrapper className="content_wrapper">
        {location && <LocationArea>{location}</LocationArea>}
        {title && <TitleArea>{title}</TitleArea>}
        <MetaWrapper className="meta_wrapper">
          {inclusiveElements && inclusiveElements.length >= 1 ?
            <div style={{ display: 'flex', justifyContent: 'justify', alignItems: 'center' }}>
              {(inclusiveElements.map((item, index) => {
                if (index === 6) {
                  return (
                    <Badge
                      count={`${inclusiveElements.length - 6}+`}
                      style={{ backgroundColor: '#008489' }}
                    />
                  )
                }
                if (index > 5) return <></>
                return (
                  <Tooltip key={item.name} title={item.name}>
                    <img
                      src={item.image.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')}
                      alt={item.name}
                      style={{
                        marginRight: '5px',
                        maxWidth: '25px', // Set the maxWidth property to 25px
                        maxHeight: '25px', // Set the maxHeight property to 25px to maintain aspect ratio
                        objectFit: 'contain', // Use 'contain' to maintain aspect ratio without stretching
                      }}
                    />
                  </Tooltip>
                )
              })
              )}
            </div>
            :
            <Tooltip title="Este sitio no cuenta con elementos inclusivos">
              <p style={{ margin: '3px 0 12px 0' }}>Sin elementos inclusivos</p>
            </Tooltip>
          }
          <div style={{ margin: '10px' }}></div>
          {rating && <RatingArea className="rating">{rating}</RatingArea>}
          {viewDetailsBtn || editBtn ? (
            <ButtonGroup className="button_group" style={{ margin: '10px 0 0 0' }}>
              {viewDetailsBtn}
              {editBtn}
            </ButtonGroup>
          ) : null}
        </MetaWrapper>
      </ContentWrapper>

    </GridCardWrapper>
  );
};

GridCard.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  price: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  editBtn: PropTypes.element,
  viewDetailsBtn: PropTypes.element,
};

export default GridCard;
