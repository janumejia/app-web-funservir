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

// const statusColorMap = {
//   Aprobado: 'green',
//   Pendiente: 'yellow',
//   Rechazado: 'red',
//   default: 'white'
// };

function timeDiff(dateStr) {

  const date = new Date(dateStr);
  const now = new Date();
  
  const diffInMs = Math.abs(now - date);
  
  const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30); 
  if(diffInMonths > 1) {
    return `${Math.floor(diffInMonths)} meses`; 
  }
  
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24); 
  if(diffInDays > 1) {
    return `${Math.floor(diffInDays)} días`;
  }  

  const diffInHours = diffInMs / (1000 * 60 * 60);
  if(diffInHours > 1) {
    return `${Math.floor(diffInHours)} horas`;
  }

  const diffInMinutes = diffInMs / (1000 * 60);
  return `${Math.floor(diffInMinutes)} minutos`;

}

const GridCard = ({
  className,
  // inclusiveElements,
  // favorite,
  location,
  title,
  classification,
  // rating,
  mapView,
  editBtn,
  viewDetailsBtn,
  children,
  myProfile,
  createdAt,
  updatedAt,
  // favoriteOriginal,
  // status,
}) => {
  let classes = viewDetailsBtn || editBtn ? `has_btn ${className}` : className;

  const renderContent = () => (
    <GridCardWrapper className={`grid_card ${classes}`.trim()}>
      <ImageWrapper className="media_wrapper">{children}</ImageWrapper>
      {/* {myProfile && favorite ? <FavoriteIcon>{favorite}</FavoriteIcon> : (favoriteOriginal ? <FavoriteIconOriginal>{favoriteOriginal}</FavoriteIconOriginal> : <></>)} */}

      <ContentWrapper className="content_wrapper">
        {location && <LocationArea>{location}</LocationArea>}
        {title && <TitleArea>{title}</TitleArea>}
        <MetaWrapper className="meta_wrapper">
          {/* {inclusiveElements && inclusiveElements.length >= 1 ?
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
                      src={item.image.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto,c_fill,h_200,w_200/')}
                      alt={item.name}
                      style={{
                        marginRight: '5px',
                        // maxWidth: '26px', // Set the maxWidth property to 25px
                        // maxHeight: '26px', // Set the maxHeight property to 25px to maintain aspect ratio
                        width: '12%',
                        height: 'auto',
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
          } */}
          {/* <div style={{ margin: '0px' }}></div> */}

          {/* </div> */}
          {/* {viewDetailsBtn || editBtn ? (
            <ButtonGroup className="button_group" style={{ margin: '0px 0 0 0' }}>
              {viewDetailsBtn}
              {editBtn}
            </ButtonGroup>
          ) : null} */}
          {updatedAt && <p style={{ margin: '0px 0 0px 0' }}>{`${createdAt === updatedAt ? "Creado" : "Modificado"} hace ${timeDiff(updatedAt)}`}</p>
          }
          
        </MetaWrapper>
        {/* {classification &&
            <div style={{ display: 'flex', justifyContent: 'justify', alignItems: 'center', backgroundColor: 'green' }}>
              {classification}
            </div>
          } */}
      </ContentWrapper>
    </GridCardWrapper>
  );

  return (
    <Badge.Ribbon
      text={classification === "inclusiveElement" ? "Elemento inclusivo" : "Barrera arquitectónica"}
      color={classification === "inclusiveElement" ? "green" : "orange"}
      style={{ top: mapView ? "178px" : "157px", paddingRight: mapView ? "14px" : "8px" }}
    >
      {renderContent()}
    </Badge.Ribbon>
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
