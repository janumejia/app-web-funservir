import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const MapWrapper = ({ children, ...rest }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  });

  if (loadError) {
    return <div>El mapa no puede ser desplegado en este momento, lo sentimos.</div>;
  }
  return <> { isLoaded && <GoogleMap {...rest}>{children} </GoogleMap> } </>
  
};

export default MapWrapper;