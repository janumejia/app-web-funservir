import { AutoComplete } from 'antd';
import { Input } from 'antd';
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

// Formato del JSON de llegada del backend que contiene el barrio y la localidad
const localitiesAndNeighborhoods = [
  { locality: "Usaquén", neighborhood: "El Toberín" },
  { locality: "Usaquén", neighborhood: "Babilonia" },
  { locality: "Usaquén", neighborhood: "Darandelos" },
  { locality: "Usaquén", neighborhood: "Estrella del Norte" },
  { locality: "Usaquén", neighborhood: "Guanoa" },
  { locality: "Usaquén", neighborhood: "Jardín Norte" },
  { locality: "Usaquén", neighborhood: "La Liberia" },
  { locality: "Usaquén", neighborhood: "La Pradera Norte" },
  { locality: "Usaquén", neighborhood: "Las Orquídeas" },
  { locality: "Usaquén", neighborhood: "Pantanito" },
  { locality: "Usaquén", neighborhood: "Santa  Mónica" },
  { locality: "Usaquén", neighborhood: "Villa Magdala" },
  { locality: "Usaquén", neighborhood: "Villas de Aranjuez" },
  { locality: "Usaquén", neighborhood: "Villas del Mediterráneo" },
  { locality: "Usaquén", neighborhood: "Zaragoza" }
]

const options = [
  {
    value: 'Burns Bay Road',
  },
  {
    value: 'Downing Street',
  },
  {
    value: 'Wall Street',
  },
];

// DESCRIPCIÓN:
// Componente para mostrar posibles sitios mientras escribes en la barra de búsqueda, usando un arreglo de objetos que contiene todos los barrios de Bogotá
const SearchInput = (props) => {
  const [neighborhoods, setNeighborhoods] = useState(localitiesAndNeighborhoods); //
  const [value, setValue] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState({});

  // Para ajustar los barrios que se mostrará en las sugerencias de la barra de búsqueda:
  const onSuggestionsFetchRequested = ({ value }) => {
    setNeighborhoods(filterNeighborhoods(value))
  }

  // Método para retornar los resultados a mostrar en las sugerencias:
  const filterNeighborhoods = (value) => {
    // Para sanitizar la entrada del usuario
    const inputValue = value.toLowerCase() // Cambia el texto a minúsculas
      .replace(/[á,à,ä,â]/g, 'a') // ... y para reemplazar las vocales con acentos por simplemente la vocal
      .replace(/[é,ë,è]/g, 'e')
      .replace(/[í,ï,ì]/g, 'i')
      .replace(/[ó,ö,ò]/g, 'o')
      .replace(/[ü,ú,ù]/g, 'u')
      .replace(/\s+/g, '') // Remover espacios
      .replace(/[_]/g, '') // Remover guion bajo
      .replace(/[^\w\s]/gi, ''); // ... y remover caracteres especiales con RegExp. Solo se permiten dígitos, caracteres y espacios en blanco. Sacado de https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp

    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];

    } else {  // Solamente se ejecuta si el usuario ha introducido algo en la barra de búsqueda
      var count = 5; // Variable para limitar a solo 5 resultados en las sugerencias
      var filtrado = localitiesAndNeighborhoods.filter((element) => { // Método filter retorna un arreglo con los elementos que cumplan la condición. Documentación: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        var stringToSearch = element.neighborhood + element.locality + element.neighborhood; // 2 veces el barrio para que se le muestren las sugerencias sin importar si digita primero el barrio o la localidad.

        if (count > 0 && stringToSearch.toLowerCase() // Para encontrar los resultados del autocompletado
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remover acentos (lo mismo que está arriba pero simplificado)
          .replace(/\s+/g, '') // Remover espacios (solo por motivo de búsqueda, y no se refleja en los resultados)
          .includes(inputValue)) {
          count--;
          return element;
        }

      })
      return filtrado;

    }
  }

  const onSuggestionsClearRequested = () => {
    setNeighborhoods([]);
  }

  // En caso de clickear la sugerencia, esto es lo que se pone en la barra de búsqueda:
  const getSuggestionValue = (suggestion) => {
    return `${suggestion.neighborhood}, ${suggestion.locality}`;
  }

  // Aquí se configura como se mostraran las sugerencias
  const renderSuggestion = (suggestion) => (
    <div className='react-autosuggest__suggestions-list' onClick={() => selectNeighborhood(suggestion)}>
      {`${suggestion.neighborhood}, ${suggestion.locality}`}
    </div>
  );

  const selectNeighborhood = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
    console.log(neighborhood)
  }

  const onChange = (e, { newValue }) => {
    setValue(newValue);
  }

  const inputProps = {
    placeholder: "Ingrese barrio o localidad",
    value,
    onChange
  }

  const eventEnter = (e) => {
    if (e.key == "Enter") {
      var split = e.target.value.split('-');
      var neighborhood = {
        neighborhood: split[0].trim(),
        locality: split[1].trim(),
      };
      selectedNeighborhood(neighborhood);
    }
  }

  return (
    <div className="map_autocomplete">
      <Autosuggest
        suggestions={neighborhoods}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={eventEnter}
      />
      {/* <AutoComplete
        // style={{
        //   width: 200,
        // }}
        options={options}
        placeholder="try to type `b`"
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      /> */}
    </div>
  );
};

export default SearchInput;