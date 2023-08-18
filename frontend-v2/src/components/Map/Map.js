import React, { useState } from 'react';
import { MarkerClusterer } from '@react-google-maps/api';
import MapWrapper from './MapWrapper';
import HotelMapMarkerCluster from './ListingPageMap';
import HotelMapMarkerSingle from './SinglePageMap';

// DESCRIPCIÓN:
// Componente para configurar el despliegue del mapa de google maps en la pantalla: Zoom del mismo, puntos en el mapa, etc.
const Map = (props) => {
  const { multiple, location } = props;

  const handleClustererClick = (data) => {
    const markerClusterer = data.getMarkers();
    console.log(`Current clicked markers length: ${markerClusterer.length}`);
    console.log(markerClusterer);
  };
  
  return (
    <>
      {multiple ? (
        <MapWrapper // Mapa general
          id="map-multiple-location"
          zoom={12} // Tamaño del zoom del mapa de google maps en la página de resultados de sitios
          center={{ // Ubicación por defecto del mapa cuando es cargado
            lat: 4.646321,
            lng: -74.118711
          }}
        >
          <MarkerClusterer // Es ese punto azul que engloba varios sitios en el mapa: https://developers.google.com/maps/documentation/javascript/marker-clustering#maps_marker_clustering-javascript
            gridSize={60}
            averageCenter
            enableRetinaIcons={true}
            onClick={handleClustererClick}
          >
            {(clusterer) => (
              <HotelMapMarkerCluster
                location={location}
                clusterer={clusterer}
              />
            )}
          </MarkerClusterer>
        </MapWrapper>
      ) : (
        <MapWrapper // Mapa de un sitio especifico
          id="map-single-location"
          mapContainerStyle={{
            height: '400px',
            width: '100%',
          }}
          zoom={15} // Tamaño del zoom del mapa de google maps en la página del sitio abierto
          center={{ // Ubicación por defecto del mapa cuando es cargado
            lat: location && location.location && location.location.lat ? parseFloat(location.location.lat) : 4.646321,
            lng: location && location.location && location.location.lng ? parseFloat(location.location.lng) : -74.118711,
          }}
        >
          <HotelMapMarkerSingle location={location} />
        </MapWrapper>
      )}
    </>
  );
};

export default Map;
