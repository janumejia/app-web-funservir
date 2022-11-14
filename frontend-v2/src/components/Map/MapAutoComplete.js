import React, { useState } from 'react';
import { Input } from 'antd';

import { useLoadScript, Autocomplete, StandaloneSearchBox } from '@react-google-maps/api'; // StandaloneSearchBox ya provee el autoComplete. Docu: https://react-google-maps-api-docs.netlify.app/#section-introduction

// DESCRIPCIÓN:
// Componente para mostrar posibles sitios mientras escribes en la barra de búsqueda, usando la API de Google Maps
const SearchInput = (props) => {
  const [autocomplete, setAutocomplete] = useState();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    language: "es", // Idioma de las sugerencias de google maps
  });
  const { getInputValue } = props;
  const [locationInput, setLocationInput] = useState({ // locationInput va a contener el valor que hay en la barra de búsqueda en todo momento
    searchedLocation: '',
    searchedPlaceAPIData: [],
  });
  const handleOnChange = (event) => {
    if (event.which === '13') { // event.which devuelve el código ASCII de la tecla que activó el evento, y 13 significa que oprimió la tecla ENTER
      event.preventDefault(); // preventDefault() es un evento sintético para evitar el comportamiento por defecto del HTML nativo. Ej: se invoca un preventDefault en el evento al enviar el formulario para evitar que el navegador se vuelva a cargar/actualizar https://www.robinwieruch.de/react-preventdefault/
      event.stopPropagation();
    }
    setLocationInput({
      searchedLocation: event.target.value, // event.target da el elemento que desencadenó el evento. Entonces, event.target.value recupera el valor de ese elemento (del campo de entrada). https://stackoverflow.com/questions/67014481/what-is-event-target-value-in-react-exactly
    });
  };

  const onLoad = (ref) => {
    // El ref es una instancia Autocomplete: https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete
    console.log("onload")
    setAutocomplete(ref); // Se ejecuta cuando se oprime el botón buscar sitio
  }

  const onPlacesChanged = () => {
    // Cuando se oprime en una de las predicciones que arroja Google maps
    // además, podemos llamar a searchBox.getPlace() para que nos entregue un Objeto con info del sitio seleccionado usando las sugerencias de Google Maps
    console.log("onPlacesChanged")
    const place = autocomplete.getPlace(); // Trae el objeto con el sitio seleccionado
    console.log(place);

    setLocationInput({ // Para que al seleccionar un valor de las sugerencias de la API de google maps se ponga el valor en la barra de búsqueda
      searchedLocation: place.name + ", " + place.formatted_address, // Aquí se pone el nuevo valor que va a tener nuestra barra de búsqueda.
      searchedPlaceAPIData: place ? place : [],
    });
    getInputValue({
      searchedLocation: place && place.name && place.formatted_address,
      searchedPlaceAPIData: place ? place : [],
    });
  };

  const handleOnPressEnter = (event) => {
    if (event.which === '13') {
      event.preventDefault();
      event.stopPropagation();
    }
    setLocationInput({ searchedLocation: event.target.value });
    getInputValue(locationInput);
  };

  if (loadError) {
    return <div>El mapa no puede ser cargado en este momento, lo sentimos.</div>;
  }

  // Limites de Bogotá. Priorizará los resultados en esta ubicación.
  const bounds = {
    north: 4.841938,
    south: 4.452522,
    east: -73.979419,
    west: -74.230731
  };

  var options = {
    types: ['neighborhood', 'locality', 'sublocality', 'sublocality_level_1', 'sublocality_level_2'], // Ver lo tipos disponibles en la documentación: https://developers.google.com/maps/documentation/javascript/supported_types#table2
    //componentRestrictions: { country: "CO" }, // Para limitar a solo Colombia (no es necesario porque ya está bounds)
    strictBounds: true, // Para limitar solo a los limites indicados en bounds
  };

  return (
    <div className="map_autocomplete">
      {isLoaded && (
        // console.log(place);
        // El && en este caso es para decir que si isLoaded es true entonces ejecute lo que está después del && .Explicación: https://stackoverflow.com/questions/40682064/what-does-operator-indicate-with-this-props-children-react-cloneelemen
        // Docu: https://react-google-maps-api-docs.netlify.app/#standalonesearchbox
        // Atributo bounds agregado para ajustar los limites de búsqueda (en un rectángulo)
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlacesChanged} bounds={bounds} options={options}>
          <Input
            // defaultBounds={new window.maps.LatLngBounds(new window.google.maps.LatLng(5.210936, -74.469522), new window.google.maps.LatLng(40.712216, -74.22655))}
            type="text"
            defaultValue=""
            value={locationInput.searchedLocation}
            placeholder="Ingresar barrio o localidad"
            size="large"
            onChange={handleOnChange}
            onPressEnter={handleOnPressEnter}
          />
        </Autocomplete>
      )}
    </div>
  );
};

const MapAutoComplete = (props) => {
  const { updateValue } = props;
  return <SearchInput getInputValue={updateValue} />;
};

export default MapAutoComplete;
