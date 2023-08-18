import React, { useState } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import Rating from 'components/UI/Rating/Rating';
import GridCard from '../GridCard/GridCard';
import TextLink from 'components/UI/TextLink/TextLink';

const MapInfoWindow = ({ data, onCloseClick }) => {

  return (
    <InfoWindow
      position={{ lat: parseFloat(data.location.lat), lng: parseFloat(data.location.lng) }}
      options={{ pixelOffset: new window.google.maps.Size(-1, 0) }}
      id={data?.id}
      onCloseClick={onCloseClick}
    >
      <GridCard
        className="info_window_card"
        location={data?.siteAddress}
        title={data && data.name && (<TextLink link={`/post/${data.name}`} content={data.name} />)}
        inclusiveElements={data?.inclusiveElements}
        // price={`$${data?.price}/Night - Free Cancellation`}
        rating={
          <Rating
            rating={data?.rating}
            ratingCount={data?.ratingCount}
            type="bulk"
          />
        }
      >
        <img src={data?.thumbUrl} alt={data?.name} />
      </GridCard>
    </InfoWindow>
  );
};

export default MapInfoWindow;
