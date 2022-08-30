import React, { useState } from 'react';
import { Input } from 'antd';

import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api'; // StandaloneSearchBox ya provee el autoComplete. Docu: https://react-google-maps-api-docs.netlify.app/#section-introduction

// DESCRIPCIÓN:
// Componente para mostrar posibles sitios mientras escribes en la barra de búsqueda, usando la API de Google Maps
const SearchInput = (props) => {
  const [searchBox, setSearchBox] = useState();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
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

  const onLoad = (ref) => setSearchBox(ref); // Se ejecuta cuando se oprime el botón buscar sitio

  const onPlacesChanged = () => { 
    // Cuando se oprime en una de las predicciones que arroja Google maps
    // además, podemos llamar a searchBox.getPlaces() para que nos entregue un Objeto con info del sitio seleccionado usando las sugerencias de Google Maps
    const places = searchBox.getPlaces();
    console.log(places[0]);

    // setLocationInput({
    //   searchedLocation: places && places[0].name && places[0].formatted_address,
    //   searchedPlaceAPIData: places ? places : [],
    // });
    // getInputValue({
    //   searchedLocation: places && places[0].name && places[0].formatted_address,
    //   searchedPlaceAPIData: places ? places : [],
    // });
    setLocationInput({ // Para que al seleccionar un valor de las sugerencias de la API de google maps se ponga el valor en la barra de búsqueda
      searchedLocation: places[0].name + ", " + places[0].formatted_address, // Aquí se pone el nuevo valor que va a tener nuestra barra de búsqueda.
      searchedPlaceAPIData: places ? places : [],
    });
    getInputValue({
      searchedLocation: places && places[0].name && places[0].formatted_address,
      searchedPlaceAPIData: places ? places : [],
    });
    console.log("esto->")
    console.log("esto->" + locationInput)
    console.log("fin->")
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

  return (
    <div className="map_autocomplete">
      {isLoaded && ( 
         // console.log(places);
        // El && en este caso es para decir que si isLoaded es true entonces ejecute lo que está después del && .Explicación: https://stackoverflow.com/questions/40682064/what-does-operator-indicate-with-this-props-children-react-cloneelemen
        // Docu: https://react-google-maps-api-docs.netlify.app/#standalonesearchbox
        // Atributo bounds agregado para ajustar los limites de búsqueda (en un rectángulo)
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
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
        </StandaloneSearchBox>
      )}
    </div>
  );
};

const MapAutoComplete = (props) => {
  const { updateValue } = props;
  return <SearchInput getInputValue={updateValue} />;
};

export default MapAutoComplete;
