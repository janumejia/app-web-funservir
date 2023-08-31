import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useNavigate, useLocation, createSearchParams, useParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import MapAutoComplete from 'components/Map/MapAutoComplete';
import { setStateToUrl, getStateFromUrl } from 'library/helpers/url_handler';
import { mapDataHelper } from 'components/Map/mapDataHelper';
import { LISTING_POSTS_PAGE } from 'settings/constant';
import { NavbarSearchWrapper } from './Header.style';

export default function NavbarSearch() {
  let navigate = useNavigate();
  // let location = useLocation();
  // const { search } = location;

  const [searchValue, setSearchValue] = useState(""); // Para ajusta el valor del campo de búsqueda

  // useEffect(() => {
  //   // console.log("search: ", search)
  //   if (search) {
  //     let searchValueSanitized = searchValue.toLowerCase() // Para encontrar los resultados del autocompletado
  //       .replace(/[áàäâ]/g, 'a') // Replace "á", "à", "ä", "â" with "a"
  //       .replace(/[éëè]/g, 'e') // Replace "é", "ë", "è" with "e"
  //       .replace(/[íïì]/g, 'i') // Replace "í", "ï", "ì" with "i"
  //       .replace(/[óöò]/g, 'o') // Replace "ó", "ö", "ò" with "o"
  //       .replace(/[üúù]/g, 'u') // Replace "ü", "ú", "ù" with "u"
  //       .replace(/\s+/g, ' ') // Remover espacios
  //       .replace(/[_]/g, ' ') // Remover guion bajo
  //       .replace(/[^\w\s]/gi, '');

  //     setSearchValue(searchValueSanitized);
  //   }

  // }, [])

  const updateValueFunc = (event) => {
    setSearchValue(event);
  };

  // const updateValueFunc = (value) => {
  //   const { searchedPlaceAPIData } = value;
  //   let tempLocation = [];
  //   const mapData = !isEmpty(searchedPlaceAPIData)
  //     ? mapDataHelper(searchedPlaceAPIData)
  //     : [];
  //   if (!isEmpty(mapData) && mapData.length !== 0) {
  //     mapData.forEach((singleMapData) =>
  //       tempLocation.push({
  //         lat: singleMapData ? singleMapData.lat.toFixed(3) : null,
  //         lng: singleMapData ? singleMapData.lng.toFixed(3) : null,
  //       })
  //     );
  //   }

  //   const searchLocation = tempLocation ? tempLocation[0] : {};
  //   if (!isEmpty(searchLocation)) {
  //     const state = getStateFromUrl(location);
  //     const query = {
  //       ...state,
  //       location: searchLocation,
  //     };
  //     const search = setStateToUrl(query);
  //     navigate(LISTING_POSTS_PAGE, { replace: true, state: search });
  //   }
  // };

  // navigate to the search page
  const goToSearchPage = () => {

    let searchValueSanitized = searchValue.toLowerCase() // Para encontrar los resultados del autocompletado
      .replace(/[áàäâ]/g, 'a') // Replace "á", "à", "ä", "â" with "a"
      .replace(/[éëè]/g, 'e') // Replace "é", "ë", "è" with "e"
      .replace(/[íïì]/g, 'i') // Replace "í", "ï", "ì" with "i"
      .replace(/[óöò]/g, 'o') // Replace "ó", "ö", "ò" with "o"
      .replace(/[üúù]/g, 'u') // Replace "ü", "ú", "ù" with "u"
      .replace(/\s+/g, ' ') // Remover espacios
      .replace(/[_+]/g, ' ') // Remover guion bajo
      .replace(/[^\w\sñ]/gi, '');

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
    <NavbarSearchWrapper className="navbar_search">
      <MapAutoComplete updateValue={(value) => updateValueFunc(value)} goToSearchPage={() => goToSearchPage()} />
      <FiSearch />
    </NavbarSearchWrapper>
  );
}
