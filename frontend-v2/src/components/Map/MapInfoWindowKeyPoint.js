import React, { useState } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import Rating from 'components/UI/Rating/Rating';
import GridCardKeyPoint from '../GridCard/GridCardKeyPoint';
import TextLink from 'components/UI/TextLink/TextLink';

const MapInfoWindow = ({ data, onCloseClick }) => {

  return (
    <InfoWindow
      position={{ lat: parseFloat(data.location.lat), lng: parseFloat(data.location.lng) }}
      options={{ pixelOffset: new window.google.maps.Size(-1, 0) }}
      id={data?.id}
      onCloseClick={onCloseClick}
    >
      <GridCardKeyPoint
        className="info_window_card"
        location={data?.formattedAddress}
        title={data && data.title && (<TextLink link={`/keypoints/${data.id}`} content={data.title} />)}
        classification={data && data?.classification}
        mapView={true}
        updatedAt={data && data?.updatedAt}
      // inclusiveElements={data?.inclusiveElements}
      // rating={
      //   <Rating
      //     rating={data?.rating}
      //     ratingCount={data?.ratingCount}
      //     type="bulk"
      //   />
      // }
      >
        {data.thumbUrl ?
          <img src={data?.thumbUrl} alt={data?.title} />
          :
          <div
            style={{
              "display": "flex",
              "align-items": "center",
              "justify-content": "center",
            }}
          >
            <img
              src={"/images/no-photos.svg"} // Para optimizar las imágenes: https://cloudinary.com/blog/adaptive_browser_based_image_format_delivery
              alt={"img"}
              key={"img"}
              draggable={false}
              style={{
                width: '120px',
                height: 'auto',
                margin: "35px 0 35px 0",
              }}
            />
          </div>
        }
      </GridCardKeyPoint>
    </InfoWindow>
  );
};

export default MapInfoWindow;
