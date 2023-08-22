import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Marker, StandaloneSearchBox } from '@react-google-maps/api';
import MapWrapper from './MapWrapper';
import { Input } from 'antd';
import MakerImage from './hotelMapMarker.png';
import { useStateMachine } from 'little-state-machine';
import addDataAction from '../../containers/Auth/SignUp/SignUpOwner/AddOwnerAction';

// Descripción:
// Esta componente muestra un mapa y un cuadro de búsqueda en la pantalla. Permite a los
// usuarios buscar una ubicación y arrastrar un marcador para seleccionar la
// ubicación exacta en el mapa. La ubicación seleccionada se almacena como un objeto con
// información sobre la dirección y la geometría de la ubicación. Además, se utiliza la API
// de Google Maps para mostrar el mapa y obtener información sobre la ubicación.

const MapWithSearchBox = (props) => {
  const [searchBox, setSearchBox] = useState(); // Guarda el estado del componente de búsqueda del mapa.
  // const [dragNDropData, setDragNDropData] = useState([]); // Guarda el estado del componente de arrastrar y soltar del mapa.
  const { updateValue, name, defaultValue } = props;// Se extrae de las props para actualizar el valor ingresado en la búsqueda de ubicaciones.
  const [locationInput, setLocationInput] = useState({ searchedLocation: '' }); // Se usa para guardar el estado de la ubicación ingresada en el campo de búsqueda.

  // Se usa para guardar el estado de los detalles de la ubicación.
  const [locationDetails, setLocationDetails] = useState({
    center: { // Centro predeterminado del mapa en Bogotá.
      lat: defaultValue && defaultValue.lat ? defaultValue.lat : 4.640560,
      lng: defaultValue && defaultValue.lng ? defaultValue.lng : -74.117027,
    },
    markers: [ // Ubicación predeterminada en Bogotá.
      {
        position: {
          lat: defaultValue && defaultValue.lat ? defaultValue.lat : 4.640560,
          lng: defaultValue && defaultValue.lng ? defaultValue.lng : -74.117027,
        },
      },
    ],
    places: [], // Array para almacenar los lugares seleccionados en el mapa.
  });

  // useEffect(() => {
  //   const getUserLocation = () => {

  //     navigator?.geolocation.getCurrentPosition(async (position) => {

  //       console.log("Latitude: ", position.coords.latitude);
  //       console.log("Longitude: ", position.coords.longitude);

  //       setLocationDetails({
  //         ...locationDetails,
  //         center: { lat: position.coords.latitude, lng: position.coords.longitude },
  //         markers: [{ position: { lat: position.coords.latitude, lng: position.coords.longitude } }],
  //       });

  //       while (!window.google) {

  //       }

  //         let tempLocArray = [];
  //         var geocoder = new window.google.maps.Geocoder(); // Crea un nuevo objeto Geocoder 

  //         // Crea un objeto que contiene las coordenadas latitud y longitud de la nueva ubicación del marcador
  //         const latlng = {
  //           lat: Number(position.coords.latitude),
  //           lng: Number(position.coords.longitude),
  //         };

  //         // Utiliza la función geocode para obtener los resultados de la búsqueda inversa de la nueva ubicación
  //         await geocoder.geocode({ latLng: latlng }, function (results, status) {
  //           if (results && results[0] && results[0].formatted_address) { // Si se encontró una dirección formateada, actualiza el estado de la entrada de ubicación con ella
  //             setLocationInput({
  //               searchedLocation: results[0] && results[0].formatted_address,
  //             });

  //             // Crea un objeto de ubicación y lo agrega a un array temporal
  //             const location = {
  //               place_id: results[0].place_id,
  //               formatted_address: results[0].formatted_address,
  //               address_components: results[0].address_components,
  //               geometry: results[0].geometry,
  //             };
  //             tempLocArray.push(location);
  //           }
  //           // setDragNDropData(tempLocArray); // Actualiza el estado del array de datos de arrastrar y soltar con el array temporal
  //         });
  //         if (tempLocArray && tempLocArray.length > 0) updateValue(tempLocArray); // Actualiza el valor del componente padre con los datos de arrastrar y soltar
  //     });
  //   }

  //   if (props.getUserLocation) getUserLocation();
  // }, [])

  const onLoad = (ref) => {
    setSearchBox(ref)

    if (props.setUserLocation) {

      // Permite ajustar la ubicación del usuario en el mapa
      navigator?.geolocation.getCurrentPosition(async (position) => {

        console.log("Latitude: ", position.coords.latitude);
        console.log("Longitude: ", position.coords.longitude);

        setLocationDetails({
          ...locationDetails,
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          markers: [{ position: { lat: position.coords.latitude, lng: position.coords.longitude } }],
        });

        while (!window.google) {

        }

        let tempLocArray = [];
        var geocoder = new window.google.maps.Geocoder(); // Crea un nuevo objeto Geocoder 

        // Crea un objeto que contiene las coordenadas latitud y longitud de la nueva ubicación del marcador
        const latlng = {
          lat: Number(position.coords.latitude),
          lng: Number(position.coords.longitude),
        };

        // Utiliza la función geocode para obtener los resultados de la búsqueda inversa de la nueva ubicación
        await geocoder.geocode({ latLng: latlng }, function (results, status) {
          if (results && results[0] && results[0].formatted_address) { // Si se encontró una dirección formateada, actualiza el estado de la entrada de ubicación con ella
            setLocationInput({
              searchedLocation: results[0] && results[0].formatted_address,
            });

            // Crea un objeto de ubicación y lo agrega a un array temporal
            const location = {
              place_id: results[0].place_id,
              formatted_address: results[0].formatted_address,
              address_components: results[0].address_components,
              geometry: results[0].geometry,
            };
            tempLocArray.push(location);
          }
          // setDragNDropData(tempLocArray); // Actualiza el estado del array de datos de arrastrar y soltar con el array temporal
        });
        if (tempLocArray && tempLocArray.length > 0) updateValue(tempLocArray); // Actualiza el valor del componente padre con los datos de arrastrar y soltar
      });
    }
  }; // Función que se ejecuta cuando el componente de búsqueda del mapa carga y recibe una referencia a ese componente como parámetro

  // Función que se ejecuta cuando se selecciona una ubicación en el componente de búsqueda del mapa
  // Obtiene las ubicaciones seleccionadas, las agrega a un objeto LatLngBounds que determina el área de visualización del mapa
  // y actualiza el estado del componente de mapa para mostrar las nuevas ubicaciones en el mapa
  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    places.forEach((place) => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    const nextMarkers = places.map((place) => ({
      position: place.geometry.location,
    }));
    const nextCenter = _.get(nextMarkers, '0.position', locationDetails.center);

    setLocationDetails({
      places,
      center: nextCenter,
      markers: nextMarkers,
    });

    setLocationInput({ // Actualiza el estado del componente de entrada de texto para mostrar la ubicación seleccionada
      searchedLocation: places && places[0] && places[0].formatted_address,
    });

    // Llama a la función updateValue que se pasa como una propiedad en las props del componente
    // y actualiza el valor de la ubicación en la aplicación
    updateValue(places);
  };

  // Función que se ejecuta al cambiar el valor del campo de búsqueda de ubicación
  const handleOnChange = (event) => {
    event.stopPropagation(); // Evita la propagación del evento a otros elementos
    if (event.which === '13') { // Si se presiona la tecla enter
      event.preventDefault(); // Previene la acción por defecto de la tecla enter
    }
    setLocationInput({ searchedLocation: event.target.value }); // Actualiza el valor del estado de la ubicación buscada
  };

  // Función que se ejecuta al presionar enter en el campo de búsqueda de ubicación
  const handleOnPressEnter = (event) => {
    event.stopPropagation(); // Evita la propagación del evento a otros elementos
    if (event.which === '13') { // Si se presiona la tecla enter
      event.preventDefault(); // Previene la acción por defecto de la tecla enter
    }
    setLocationInput({ searchedLocation: event.target.value }); // Actualiza el valor del estado de la ubicación buscada
  };

  // Función que se ejecuta al finalizar el arrastre del marcador en el mapa
  const onDragEndFunc = async (marker) => {
    let tempLocArray = [];
    var geocoder = new window.google.maps.Geocoder(); // Crea un nuevo objeto Geocoder 

    // Crea un objeto que contiene las coordenadas latitud y longitud de la nueva ubicación del marcador
    const latlng = {
      lat: Number(marker.latLng.lat()),
      lng: Number(marker.latLng.lng()),
    };

    // Actualiza el estado de los detalles de la ubicación con la nueva ubicación del marcador
    setLocationDetails({
      ...locationDetails,
      center: latlng,
    });

    // Utiliza la función geocode para obtener los resultados de la búsqueda inversa de la nueva ubicación
    await geocoder.geocode({ latLng: latlng }, function (results, status) {
      if (results && results[0] && results[0].formatted_address) { // Si se encontró una dirección formateada, actualiza el estado de la entrada de ubicación con ella
        setLocationInput({
          searchedLocation: results[0] && results[0].formatted_address,
        });

        // Crea un objeto de ubicación y lo agrega a un array temporal
        const location = {
          place_id: results[0].place_id,
          formatted_address: results[0].formatted_address,
          address_components: results[0].address_components,
          geometry: results[0].geometry,
        };
        tempLocArray.push(location);
      }
      // setDragNDropData(tempLocArray); // Actualiza el estado del array de datos de arrastrar y soltar con el array temporal
    });
    updateValue(tempLocArray); // Actualiza el valor del componente padre con los datos de arrastrar y soltar
  };

  // Para que ajuste la ubicación de acuerdo a lo ingresado por el usuario dueño de sitio en los campos de Dirección, Localidad y Barrio
  // const { state } = useStateMachine({ addDataAction });

  // useEffect(() => {
  //   const country = "Colombia";
  //   let address, neighborhood, locality;

  //   if(typeof state.data2.siteAddress === "undefined") address = ""
  //   else address = state.data2.siteAddress

  //   if(typeof state.data2.locality === "undefined") locality = ""
  //   else locality = state.data2.locality

  //   if(typeof state.data2.neighborhood === "undefined") neighborhood = ""
  //   else neighborhood = state.data2.neighborhood

  //   // Cambiar el texto del campo de búsqueda aquí
  //   setLocationInput({ searchedLocation: address + ", " + locality + ", " + neighborhood + ", " + country });

  //   // Cambiar centro del mapa aquí
  //   if(locationInput.searchedLocation != ''){
  //     const places = searchBox.getPlaces();
  //     if (places.length > 0) {
  //       const place = places[0];
  //       const center = place.geometry.location;
  //       setLocationDetails({
  //         ...locationDetails,
  //         center: {
  //           lat: center.lat(),
  //           lng: center.lng(),
  //         },
  //       });
  //     }
  //   }
  // }, [state]);

  // Sobre el return:
  // Devuelve un componente MapWrapper de Google Maps que muestra un mapa centrado en la ubicación actual.
  // También incluye un campo de búsqueda StandaloneSearchBox que permite a los usuarios buscar ubicaciones en el mapa.
  // Cuando se ingresa una ubicación en el campo de búsqueda, la función onPlacesChanged se ejecuta y actualiza el estado de la ubicación.
  // También hay marcadores en el mapa que se pueden arrastrar para actualizar la ubicación.
  return (
    <MapWrapper
      id="map-search-box"
      mapContainerStyle={{
        height: '400px',
        width: '100%',
      }}
      zoom={15}
      center={locationDetails.center}
    >
      <StandaloneSearchBox
        onLoad={onLoad}
        // controlPosition={window.google.maps.ControlPosition.TOP_LEFT} // Ocasiona que todo se dañe. No descomentar
        onPlacesChanged={onPlacesChanged}
      >
        <Input
          type="text"
          name={name}
          placeholder="Ingresa la ubicación del sitio"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `60%`,
            height: `40px`,
            marginTop: `10px`,
            marginLeft: `10px`,
            padding: `0 12px`,
            borderRadius: `2px`,
            boxShadow: `0 3px 6px rgba(0, 0, 0, 0.16)`,
            fontSize: `15px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
          defaultValue=""
          value={locationInput ? locationInput.searchedLocation : ''}
          onChange={handleOnChange} // Manejador para cambios en el valor del campo de búsqueda
          onPressEnter={handleOnPressEnter} // Manejador para la tecla Enter presionada en el campo de búsqueda
        />
      </StandaloneSearchBox>
      {locationDetails.markers.map((marker, index) => {
        return (
          <Marker
            draggable={true}
            icon={MakerImage}
            key={index}
            position={marker.position}
            onDragEnd={(marker) => onDragEndFunc(marker)}  // Manejador para el final del arrastre del marcador
          />
        );
      })}
    </MapWrapper>
  );
};

export default MapWithSearchBox;