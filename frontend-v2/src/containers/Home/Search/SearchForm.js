import React, { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty'; // Verifica si un objeto, colección, mapa o set está vació. Retorna true si está vació.
import { FaMapMarkerAlt, FaRegCalendar, FaUserFriends, FaSearch } from 'react-icons/fa';
import { Button } from 'antd';
import DateRangePickerBox from 'components/UI/DatePicker/ReactDates';
import MapAutoComplete from 'components/Map/MapAutoComplete'; // Corresponde al campo de búsqueda (barrio o localidad)
import { mapDataHelper } from 'components/Map/mapDataHelper';
import ViewWithPopup from 'components/UI/ViewWithPopup/ViewWithPopup';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import { setStateToUrl } from 'library/helpers/url_handler';
import { LISTING_POSTS_PAGE } from 'settings/constant';
import {
  FormWrapper,
  ComponentWrapper,
  RoomGuestWrapper,
  ItemWrapper,
} from './Search.style';

// DESCRIPCIÓN:
// Componente hija de SearchArea (Archivo Search.js), y es donde se configura la barra de búsqueda: Campo de búsqueda, botón de búsqueda, se incorpora el autocompletado de google maps, etc.
export default function SearchForm() {
  let navigate = useNavigate();

  // place data
  const [searchValue, setSearchValue] = useState(""); // Para ajusta el valor del campo de búsqueda
  const updateValueFunc = (event) => {
    setSearchValue(event);

  };

  // navigate to the search page
  const goToSearchPage = () => {

    let searchValueSanitized = searchValue.toLowerCase() // Para encontrar los resultados del autocompletado
      .replace(/[áàäâ]/g, 'a') // Replace "á", "à", "ä", "â" with "a"
      .replace(/[éëè]/g, 'e') // Replace "é", "ë", "è" with "e"
      .replace(/[íïì]/g, 'i') // Replace "í", "ï", "ì" with "i"
      .replace(/[óöò]/g, 'o') // Replace "ó", "ö", "ò" with "o"
      .replace(/[üúù]/g, 'u') // Replace "ü", "ú", "ù" with "u"
      .replace(/\s+/g, ' ') // Remover espacios
      .replace(/[_]/g, ' ') // Remover guion bajo
      .replace(/[^\w\s]/gi, '');

    if (searchValueSanitized === "" || !(/[A-Za-z0-9]/.test(searchValueSanitized))) {
      navigate({
        pathname: LISTING_POSTS_PAGE,
      });

    } else {
      navigate({
        pathname: LISTING_POSTS_PAGE,
        search: `?${createSearchParams(`buscar=${searchValueSanitized}`)}`,
      });
    }
  };

  return (
    <FormWrapper>
      {/* Campo de búsqueda: Barrio o localidad */}

      <ComponentWrapper>
        <FaSearch className="map-marker" />
        <MapAutoComplete updateValue={(value) => { updateValueFunc(value) }} /> {/* Campo de búsqueda */}
      </ComponentWrapper>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        onClick={goToSearchPage}
      >
        Buscar
      </Button>
    </FormWrapper>
  );
}
