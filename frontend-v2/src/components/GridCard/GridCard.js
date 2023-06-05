import React from 'react';
import PropTypes from 'prop-types';
import { FaWifi, FaCarAlt, FaSwimmer, FaAirFreshener, FaAccessibleIcon, FaBlind } from 'react-icons/fa'; // Documentación React Icons: https://react-icons.github.io/react-icons
import GridCardWrapper, {
  ImageWrapper,
  FavoriteIcon,
  ContentWrapper,
  LocationArea,
  TitleArea,
  PriceArea,
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
  price,
  rating,
  editBtn,
  viewDetailsBtn,
  children,
}) => {
  let classes = viewDetailsBtn || editBtn ? `has_btn ${className}` : className;
  return (
    <GridCardWrapper className={`grid_card ${classes}`.trim()}>
      <ImageWrapper className="media_wrapper">{children}</ImageWrapper>
      <ContentWrapper className="content_wrapper">
        {location && <LocationArea>{location}</LocationArea>}
        {title && <TitleArea>{title}</TitleArea>}
        <MetaWrapper className="meta_wrapper">
          {inclusiveElements && inclusiveElements.map((item) => {
            return (
                <img
                  src={item.image.secure_url}
                  alt={item.name}
                  style={{
                    width: '10%',
                    height: 'auto',
                    objectFit: 'scale-down',
                  }}
                />
            )
          })}
          {rating && <RatingArea className="rating">{rating}</RatingArea>}
          <div style={{margin:'10px'}}></div>
          {viewDetailsBtn || editBtn ? (
            <ButtonGroup className="button_group" style={{margin:'5px 0 0 0'}}>
              {viewDetailsBtn}
              {editBtn}
            </ButtonGroup>
          ) : null}
        </MetaWrapper>
      </ContentWrapper>

      {/* Este es el corazón que aparece en el sitio */}
      {/* {favorite && <FavoriteIcon>{favorite}</FavoriteIcon>} */}

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
