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
  const [mapValue, setMapValue] = useState([]); // Para ajusta el valor del campo de búsqueda
  const updateValueFunc = (event) => {
    const { searchedPlaceAPIData } = event;
    if (!isEmpty(searchedPlaceAPIData)) {
      setMapValue(searchedPlaceAPIData);
    }
  };

  // navigate to the search page
  const goToSearchPage = () => {
    let tempLocation = [];
    console.log("mapValue:")
    console.log(mapValue)
    //const mapData = mapValue ? mapDataHelper(mapValue) : [];
    // console.log("mapData:**")
    // console.log(mapData)
    // mapData &&
    //   mapData.map((singleMapData, i) => {
    //     return tempLocation.push({
    //       name: singleMapData ? singleMapData.name : '',
    //       formattedAddress: singleMapData ? singleMapData.formattedAddress : '',
    //       lat: singleMapData ? singleMapData.lat.toFixed(3) : null,
    //       lng: singleMapData ? singleMapData.lng.toFixed(3) : null,
    //     });
    //   });
    // console.log("tempLocation:******")
    console.log(tempLocation)
    const location = tempLocation ? tempLocation[1] : {};
    // console.log("////location/////")
    console.log(location)
    const query = {
      // date_range: searchDate,
      // room: roomGuest.room,
      // guest: roomGuest.guest,
      location,
    };
    console.log(query)
    // const search = setStateToUrl(query);
    const search = "search=" + mapValue.name;
    console.log("mapValue.name -> ", mapValue.name)
    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
  };

  return (
    <FormWrapper>
      {/* Campo de búsqueda: Barrio o localidad */}

      <ComponentWrapper>
        <FaMapMarkerAlt className="map-marker" />
        <MapAutoComplete updateValue={(value) => {updateValueFunc(value); console.log("value --->", value) } }/> {/* Campo de búsqueda */}
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
