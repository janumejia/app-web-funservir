import React, { useContext, useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { OtherVariablesContext } from 'context/OtherVariablesProvider';

// DESCRIPCIÓN:
// Componente para mostrar posibles sitios mientras escribes en la barra de búsqueda, usando un arreglo de objetos que contiene todos los barrios de Bogotá
const SearchInput = (props) => {

  const {
    allNeighborhoods,
    allCategories,
    allSiteNames,
    allLocations,
  } = useContext(OtherVariablesContext);

  const [value, setValue] = useState("");

  // const [selectedSuggestions, setSelectedSuggestions] = useState({});
  const [suggestions, setSuggestions] = useState([]); //
  const [allSuggestionsSearchBar, setSuggestionsSearchBar] = useState([]);

  // useEffect(() => {
  //   props.updateValue();
  // }, [value]);

  useEffect(() => { // Para construir la lista completa de las sugerencias

    const buildSuggestionList = () => {
      let allSuggestions = [];

      allLocations.forEach((element) => {
        allSuggestions.push(`${element.name}`)
      })

      allNeighborhoods.forEach((element) => {
        allSuggestions.push(`${element.name}, ${element.associatedLocality}`)
      })

      allCategories.forEach((element) => {
        allSuggestions.push(`${element.name}`)
      })

      allSiteNames.forEach((element) => {
        allSuggestions.push(`${element.name}`)
      })

      setSuggestionsSearchBar(allSuggestions); // Aquí se ajustan toda la lista de sugerencias
    }


    if (Array.isArray(allLocations) && allLocations.length > 0 &&
      Array.isArray(allNeighborhoods) && allNeighborhoods.length > 0 &&
      Array.isArray(allCategories) && allCategories.length > 0 &&
      Array.isArray(allSiteNames) && allSiteNames.length > 0) buildSuggestionList();

  }, [allLocations, allNeighborhoods, allCategories, allSiteNames]);

  // Para ajustar los barrios que se mostrará en las sugerencias de la barra de búsqueda:
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(filterNeighborhoods(value))
  }

  // Método para retornar los resultados a mostrar en las sugerencias:
  const filterNeighborhoods = (value) => {
    // Para sanitizar la entrada del usuario
    const inputValue = value.toLowerCase() // Cambia el texto a minúsculas
      .replace(/[áàäâ]/g, 'a') // ... y para reemplazar las vocales con acentos por simplemente la vocal
      .replace(/[éëè]/g, 'e')
      .replace(/[íïì]/g, 'i')
      .replace(/[óöò]/g, 'o')
      .replace(/[üúù]/g, 'u')
      .replace(/\s+/g, ' ') // Remover espacios
      .replace(/[_]/g, ' ') // Remover guion bajo
      .replace(/[^\w\s]/gi, ''); // ... y remover caracteres especiales con RegExp. Solo se permiten dígitos, caracteres y espacios en blanco. Sacado de https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp

    const inputLength = inputValue.length;

    if (inputLength === 0 || !(allSuggestionsSearchBar.length > 0)) {
      return [];

    } else {  // Solamente se ejecuta si el usuario ha introducido algo en la barra de búsqueda

      let count = 8; // Variable para limitar a solo 5 resultados en las sugerencias

      let filtrado = allSuggestionsSearchBar.filter((element) => { // Método filter retorna un arreglo con los elementos que cumplan la condición. Documentación: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        let stringToSearch = "";

        if (/^[^,]*,[^,]*$/.test(element)) {
          const parts = element.split(",");
          stringToSearch = `bogota ${element} bogota ${parts[1]} ${parts[0]}`;
        } else {
          stringToSearch = element; // 2 veces el barrio para que se le muestren las sugerencias sin importar si digita primero el barrio o la localidad.
        }

        if (count > 0 && stringToSearch.toLowerCase() // Para encontrar los resultados del autocompletado
          // .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remover acentos (lo mismo que está arriba pero simplificado)
          .replace(/[áàäâ]/g, 'a') // Replace "á", "à", "ä", "â" with "a"
          .replace(/[éëè]/g, 'e') // Replace "é", "ë", "è" with "e"
          .replace(/[íïì]/g, 'i') // Replace "í", "ï", "ì" with "i"
          .replace(/[óöò]/g, 'o') // Replace "ó", "ö", "ò" with "o"
          .replace(/[üúù]/g, 'u') // Replace "ü", "ú", "ù" with "u"
          .replace(/,/g, '')
          .replace(/\s+/g, ' ') // Remover espacios (solo por motivo de búsqueda, y no se refleja en los resultados)
          .includes(inputValue)) {
          count--;
          return element;
        }

      })
      return filtrado;
    }
  }

  // En caso de clickear la sugerencia, esto es lo que se pone en la barra de búsqueda:
  const getSuggestionValue = (suggestion) => {
    return `${suggestion}`;
  }

  // Aquí se configura como se mostraran las sugerencias
  const renderSuggestion = (suggestion) => (
    <div className='react-autosuggest__suggestions-list'>
      {suggestion}
    </div>
  );

  const onChange = (e, { newValue }) => {
    setValue(newValue);
    props.updateValue(newValue);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      props.goToSearchPage();
    }
  };

  const inputProps = {
    placeholder: "Busca por categoría, nombre, barrio o localidad",
    value,
    onChange,
    onKeyDown: handleKeyPress, // Add the keydown event listener to handle the "Enter" key press
  }

  return (
    <div className="map_autocomplete">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </div>
  );
};

export default SearchInput;