import React, { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty'; // Verifica si un objeto, colección, mapa o set está vació. Retorna true si está vació.
import { FaMapMarkerAlt, FaRegCalendar, FaUserFriends, FaSearch } from 'react-icons/fa';
import { Button } from 'antd';
import DateRangePickerBox from 'components/UI/DatePicker/ReactDates';
import MapAutoComplete from 'components/Map/MapAutoComplete'; // Corresponde al segundo campo de búsqueda (barrio o localidad)
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

// const calendarItem = {
//   separator: '-',
//   format: 'MM-DD-YYYY',
//   locale: 'en',
// };

// DESCRIPCIÓN:
// Componente hija de SearchArea (Archivo Search.js), y es donde se configura la barra de búsqueda: Campo de búsqueda, botón de búsqueda, se incorpora el autocompletado de google maps, etc.
export default function SearchForm() {
  let navigate = useNavigate();
  // const [searchDate, setSearchDate] = useState({
  //   setStartDate: null,
  //   setEndDate: null,
  // });

  // place data
  const [mapValue, setMapValue] = useState([]); // Para ajusta el valor del campo de búsqueda
  const updateValueFunc = (event) => {
    const { searchedPlaceAPIData } = event;
    if (!isEmpty(searchedPlaceAPIData)) {
      setMapValue(searchedPlaceAPIData);
    }
  };

  // Room guest state
  // const [roomGuest, setRoomGuest] = useState({
  //   room: 0,
  //   guest: 0,
  // });
  // const handleIncrement = (type) => {
  //   setRoomGuest({
  //     ...roomGuest,
  //     [type]: roomGuest[type] + 1,
  //   });
  // };
  // const handleDecrement = (type) => {
  //   if (roomGuest[type] <= 0) {
  //     return false;
  //   }
  //   setRoomGuest({
  //     ...roomGuest,
  //     [type]: roomGuest[type] - 1,
  //   });
  // };
  // const handleIncDecOnChange = (e, type) => {
  //   let currentValue = e.target.value;
  //   setRoomGuest({
  //     ...roomGuest,
  //     [type]: currentValue,
  //   });
  // };

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
    console.log("tempLocation:******")
    console.log(tempLocation)
    const location = tempLocation ? tempLocation[1] : {};
    console.log("////location/////")
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
    console.log(mapValue.name)
    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
  };

  return (
    <FormWrapper>

      {/* Primer campo de búsqueda: ¿Qué buscas? */}
      {/* <ComponentWrapper>
        <FaSearch className="map-marker" />
        <MapAutoComplete1 updateValue={(value) => updateValueFunc(value)} /> Campo de búsqueda */}
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          x="0px"
          y="0px"
          width="30"
          height="30"
          viewBox="0 0 144.083 144"
          enableBackground="new 0 0 144.083 144"
          className="target"
        >
          <path d="M117.292,69h-13.587C102.28,53.851,90.19,41.761,75.042,40.337V26.5h-6v13.837C53.893,41.761,41.802,53.851,40.378,69  H26.792v6h13.587c1.425,15.148,13.515,27.238,28.663,28.663V117.5h6v-13.837C90.19,102.238,102.28,90.148,103.705,75h13.587V69z   M72.042,97.809c-14.23,0-25.809-11.578-25.809-25.809c0-14.231,11.578-25.809,25.809-25.809S97.85,57.769,97.85,72  C97.85,86.23,86.272,97.809,72.042,97.809z" />
          <path d="M72.042,52.541c-10.729,0-19.459,8.729-19.459,19.459s8.729,19.459,19.459,19.459S91.5,82.729,91.5,72  S82.771,52.541,72.042,52.541z M72.042,85.459c-7.421,0-13.459-6.037-13.459-13.459c0-7.421,6.038-13.459,13.459-13.459  S85.5,64.579,85.5,72C85.5,79.422,79.462,85.459,72.042,85.459z" />
        </svg> */}
      {/* </ComponentWrapper> */}

      {/* Segundo campo de búsqueda: Barrio o localidad */}
      <ComponentWrapper>
        <FaMapMarkerAlt className="map-marker" />
        <MapAutoComplete updateValue={(value) => updateValueFunc(value)} /> {/* Campo de búsqueda */}
      </ComponentWrapper>

      {/* Parte del calendario */}

      {/* <ComponentWrapper>
        <FaRegCalendar className="calendar" />
        <DateRangePickerBox
          item={calendarItem}
          startDateId="startDateId-id-home"
          endDateId="endDateId-id-home"
          updateSearchData={(setDateValue) => setSearchDate(setDateValue)}
          showClearDates={true}
          small={true}
          numberOfMonths={1}
        />
      </ComponentWrapper> */}

      {/* Parte de seleccionar cantidad de personas a reservar */}

      {/* <ComponentWrapper>
        <FaUserFriends className="user-friends" />
        <ViewWithPopup
          key={200}
          noView={true}
          className="room_guest"
          view={
            <Button type="default">
              <span>Room {roomGuest.room > 0 && `: ${roomGuest.room}`}</span>
              <span>-</span>
              <span>Guest{roomGuest.guest > 0 && `: ${roomGuest.guest}`}</span>
            </Button>
          }
          popup={
            <RoomGuestWrapper>
              <ItemWrapper>
                <strong>Room</strong>
                <InputIncDec
                  id="room"
                  increment={() => handleIncrement('room')}
                  decrement={() => handleDecrement('room')}
                  onChange={(e) => handleIncDecOnChange(e, 'room')}
                  value={roomGuest.room}
                />
              </ItemWrapper>
              <ItemWrapper>
                <strong>Guest</strong>
                <InputIncDec
                  id="guest"
                  increment={() => handleIncrement('guest')}
                  decrement={() => handleDecrement('guest')}
                  onChange={(e) => handleIncDecOnChange(e, 'guest')}
                  value={roomGuest.guest}
                />
              </ItemWrapper>
            </RoomGuestWrapper>
          }
        />
      </ComponentWrapper> */}

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
