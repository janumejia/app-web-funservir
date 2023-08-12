import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';
import { Button, Slider, Checkbox, Space } from 'antd';
import ViewWithPopup from 'components/UI/ViewWithPopup/ViewWithPopup';
import ViewWithPopupElements from 'components/UI/ViewWithPopup/ViewWithPopupElements';
import ViewWithPopupCategories from 'components/UI/ViewWithPopup/ViewWithPopupCategories';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import DateRangePicker from 'components/UI/DatePicker/ReactDates';
import { setStateToUrl, getStateFromUrl } from '../url-handler';
import { LISTING_POSTS_PAGE } from 'settings/constant';
import {
  priceInit,
  calenderItem,
  getAmenities,
  getPropertyType,
} from '../SearchParams';
import CategorySearchWrapper, {
  RoomGuestWrapper,
  ItemWrapper,
  ActionWrapper,
} from './CategorySearch.style';
import { OtherVariablesContext } from 'context/OtherVariablesProvider';
import { AiOutlineClear } from 'react-icons/ai';
import Select from 'react-select'
import { update } from 'lodash';


const CategorySearch = ({ location }) => {
  let navigate = useNavigate();

  const { allElements, allNeighborhoods, allLocations, allCategories } = useContext(OtherVariablesContext)

  console.log("allElements: ", allElements)

  const [selectedLocality, setSelectedLocality] = useState();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState();
  // const [neighborhoodOptions, setNeighborhoodOptions] = useState();
  const [bestRating, setBestRating] = useState(false);

  const searchParams = getStateFromUrl(location);
  const state = {
    buscar: searchParams.buscar || [],
    elementos: searchParams.elementos || [],
    categoria: searchParams.categoria || [],
    // location: searchParams.ubicacion || [],
    // date_range: searchParams.date_range || {
    //   setStartDate: null,
    //   setEndDate: null,
    // },
    // price: searchParams.price || {
    //   min: 0,
    //   max: 100,
    //   defaultMin: 0,
    //   defaultMax: 100,
    // },
    // ubicacion: searchParams.ubicacion || {
    //   locality: null,
    //   neighborhood: null,
    // },
    ubicacion: searchParams.ubicacion || [],
    // localidad: searchParams.localidad || [],
    // room: parseInt(searchParams.room) || 0,
    // guest: parseInt(searchParams.guest) || 0,
    mejorPuntuacion: searchParams.mejorPuntuacion || [],
  };


  const { buscar, elementos, categoria, ubicacion, localidad, mejorPuntuacion } = state;
  // const [countRoom, setRoom] = useState(room);
  // const [countGuest, setGuest] = useState(guest);

  const onChange = (value, type, localityOrNeighborhood) => {
    console.log("Elementos: ", elementos);
    console.log("value: ", value, " type: ", type)

    let query = {};
    if (type === 'mejorPuntuacion') {
      if (value === true) {
        query = {
          ...state,
          [type]: "si",
        };
      } else {
        query = {
          ...state,
          [type]: "no",
        };
      }
    } else if (type === 'ubicacion') {
      if (localityOrNeighborhood && localityOrNeighborhood === 'localidad') {
        if (value === null) {
          if (state.ubicacion && /^[^,]*,[^,]+$/.test(state.ubicacion)) {
            query = {
              ...state,
              [type]: "," + state.ubicacion.split(',')[1],
            };
          } else {
            query = {
              ...state,
              [type]: "",
            };
          }
        } else {
          query = {
            ...state,
            [type]: value.value + ",",
          };
          setSelectedNeighborhood(null);
        }
      } else if (localityOrNeighborhood && localityOrNeighborhood === 'barrio') {
        if (value === null) {
          if (state.ubicacion && /^[^,]+,[^,]*$/.test(state.ubicacion)) {
            query = {
              ...state,
              [type]: state.ubicacion.split(',')[0] + ",",
            };
          } else {
            query = {
              ...state,
              [type]: "",
            };
          }

        } else {
          if (state && state.ubicacion && /^[^,]+,[^,]*$/.test(state.ubicacion)) {
            query = {
              ...state,
              [type]: state.ubicacion.split(',')[0] + "," + value.value,
            };
          }
          else {
            query = {
              ...state,
              [type]: "," + value.value,
            };
          }
        }
      }
    } else {
      query = {
        ...state,
        [type]: value,
      };
    }

    const search = setStateToUrl(query);
    console.log("LA NUEVA SEARCH EN CATEGORY: ", search)
    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
  };

  // const handleRoomGuestApply = () => {
  //   const query = {
  //     ...state,
  //     room: countRoom,
  //     guest: countGuest,
  //   };
  //   const search = setStateToUrl(query);
  //   navigate({
  //     pathname: LISTING_POSTS_PAGE,
  //     search: `?${createSearchParams(search)}`,
  //   });
  // };

  // const handleRoomGuestCancel = () => {
  //   setRoom(0);
  //   setGuest(0);
  //   const query = {
  //     ...state,
  //     room: 0,
  //     guest: 0,
  //   };
  //   const search = setStateToUrl(query);
  //   navigate({
  //     pathname: LISTING_POSTS_PAGE,
  //     search: `?${createSearchParams(search)}`,
  //   });
  // };

  const onSearchReset = () => {
    // setRoom(0);
    // setGuest(0);
    let search = {};
    if (state?.buscar.length !== 0) search = setStateToUrl({ buscar: state.buscar });
    else search = setStateToUrl({ reset: '' });
    setBestRating(false);
    setSelectedLocality(null);
    setSelectedNeighborhood(null);

    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
  };

  // useEffect(() => {
  //   const defaultLocality = () => {

  //     if (typeof ubicacion === "string" && ubicacion) {
  //       const locationName = ubicacion.split(',')[0].replace(/-/g, ' ');
  //       const foundLocation = allLocations.find(element => element.name === locationName);

  //       if (foundLocation) {
  //         const formattedName = foundLocation.name.replace(/ /g, '-');
  //         return { label: foundLocation.name, value: formattedName };
  //       }
  //     }

  //     return null;
  //   }

  //   const defaultNeighborhood = () => {
  //     if (typeof ubicacion === "string" && ubicacion) {
  //       const neighborhoodName = ubicacion.split(',')[1].replace(/-/g, ' ');
  //       const foundNeighborhood = allNeighborhoods.find(element => element.name === neighborhoodName);

  //       if (foundNeighborhood) {
  //         const formattedName = foundNeighborhood.name.replace(/ /g, '-');
  //         return { label: foundNeighborhood.name, value: formattedName };
  //       }
  //     }

  //     return null;
  //   }

  //   setSelectedLocality(defaultLocality());
  //   setSelectedNeighborhood(defaultNeighborhood());

  // }, [])

  const setOptions = () => {
    return allNeighborhoods.map((neighborhood) => {
      if(ubicacion && /^[^,]*,[^,]*$/.test(ubicacion)) {
      // if (selectedLocality && selectedLocality.label && selectedLocality.label.length > 0) {
        if (neighborhood.associatedLocality === ubicacion.split(",")[0].replace(/-/g, ' ')) {
          return {
            label: neighborhood.name,
            value: neighborhood.name.replace(/ /g, '-'),
          }
        }
      } else {
        return {
          label: neighborhood.name,
          value: neighborhood.name.replace(/ /g, '-'),
        }
      }
    }).filter(option => option); // Remove any undefined options
  }

  const theOptions = setOptions();

  // useEffect(() => {
  //   if (selectedLocality && selectedLocality.label && selectedLocality.label.length > 0) setNeighborhoodOptions(setOptions());

  // }, [selectedLocality])

  useEffect(() => {
    if (bestRating) onChange(true, 'mejorPuntuacion');
    else onChange(false, 'mejorPuntuacion');
    console.log("mejorPuntuacion: ", mejorPuntuacion);
  }, [bestRating, mejorPuntuacion])

  useEffect(() => {
    if (searchParams.mejorPuntuacion === "si") setBestRating(true)
    // if (selectedLocality && selectedLocality.label && selectedLocality.label.length > 0) setNeighborhoodOptions(setOptions());
  }, [])

  return (
    <CategorySearchWrapper>
      <ViewWithPopupElements
        className={elementos.length ? 'activated' : ''}
        key={"elementos"}
        noView={true}
        view={
          <Button type="default">
            Elementos inclusivos
            {elementos.length > 0 && `: ${elementos.length}`}
          </Button>
        }
        popup={
          <Checkbox.Group
            options={allElements.map((element) => {
              return { label: element?.name, value: element?.name.replace(/ /g, '-') }
            })}
            defaultValue={elementos}
            onChange={(value) => onChange(value, 'elementos')}
          />
        }
      />

      <ViewWithPopupCategories
        className={categoria.length ? 'activated' : ''}
        key={"categoria"}
        noView={true}
        view={
          <Button type="default">
            Categoría
            {categoria.length > 0 && `: ${categoria.length}`}
          </Button>
        }
        popup={
          <Checkbox.Group
            options={allCategories.map((element) => {
              return { label: element?.name, value: element?.name.replace(/ /g, '-') }
            })}
            defaultValue={categoria}
            onChange={(value) => onChange(value, 'categoria')}
          />
        }
      />
      {console.log("ubicacion: ", ubicacion)}
      {console.log(typeof ubicacion === "string")}
      <ViewWithPopup
        className={ubicacion.length ? 'activated' : ''}
        key={"ubicacion"}
        noView={true}
        style={{ align: "center" }}
        view={
          <Button type="default">
            Ubicación
            {/* {ubicacion.length > 0 && `: ${ubicacion.length}`} */}
          </Button>
        }
        popup={
          <RoomGuestWrapper>
            <div>
              <Select
                // style={{ "align-content": "center", "align-items": "center", "align-self": "center", "align-tracks": "center" }}
                isSearchable={true}
                isClearable={true}
                placeholder="Selecciona una localidad"
                defaultValue={() => {
                  if (typeof ubicacion === "string" && ubicacion) {
                    const locationName = ubicacion.split(',')[0].replace(/-/g, ' ');
                    const foundLocation = allLocations.find(element => element.name === locationName);

                    if (foundLocation) {
                      const formattedName = foundLocation.name.replace(/ /g, '-');
                      return { label: foundLocation.name, value: formattedName };
                    }
                  }

                  return null;
                }}
                onChange={(valueSelect) => {
                  setSelectedLocality(valueSelect);
                  console.log(valueSelect)
                  try {
                    onChange(valueSelect, 'ubicacion', 'localidad');
                  } catch (error) {
                    console.error("Error in onchange ubicacion:", error);
                  }
                }}
                // value={selectedLocality}
                options={allLocations.map((locality) => ({
                  label: locality.name,
                  value: locality.name.replace(/ /g, '-'),
                }))}
              />
            </div>
            <div style={{ "margin": "20px 0 0 0" }}>
              <Select
                // style={{ "align-content": "center", "align-items": "center", "align-self": "center", "align-tracks": "center" }}
                isSearchable={true}
                isClearable={true}
                placeholder="Selecciona un barrio"
                defaultValue={() => {
                  if (typeof ubicacion === "string" && ubicacion) {
                    const neighborhoodName = ubicacion.split(',')[1].replace(/-/g, ' ');
                    const foundNeighborhood = allNeighborhoods.find(element => element.name === neighborhoodName);

                    if (foundNeighborhood) {
                      const formattedName = foundNeighborhood.name.replace(/ /g, '-');
                      return { label: foundNeighborhood.name, value: formattedName };
                    }
                  }

                  return null;
                }}
                // value={selectedNeighborhood}
                onChange={(valueSelect) => {
                  setSelectedNeighborhood(valueSelect);
                  console.log(valueSelect)
                  try {
                    onChange(valueSelect, 'ubicacion', 'barrio');
                  } catch (error) {
                    console.error("Error in onchange ubicacion:", error);
                  }
                }}
                // options={allNeighborhoods.map((neighborhood) => {
                //   console.log("selectedLocality: " + selectedLocality)
                //   if (ubicacion && Array.isArray(ubicacion) && ubicacion.length !== 0 && /^[^,]*,[^,]*$/.test(ubicacion[0])) {
                //     if (ubicacion[0].split(',')[0].length !== 0 && neighborhood.associatedLocality === ubicacion[0].split(',')[0]) {
                //       return {
                //         label: neighborhood.name,
                //         value: neighborhood.name.replace(/ /g, '-'),
                //       }
                //     }
                //   } else {
                //     return {
                //       label: neighborhood.name,
                //       value: neighborhood.name.replace(/ /g, '-'),
                //     }
                //   }
                // })}
                options={theOptions}
              />
            </div>
          </RoomGuestWrapper>
        }
      />

      <div className={"view_with__popup" + (bestRating ? ' activated' : '')}>
        <div className="popup_handler">
          <Button type="default" onClick={() => setBestRating(!bestRating)}>
            Mejor puntuación
          </Button>
        </div>
      </div>

      {/* 
      <ViewWithPopup
        className={
          Object.keys('date_range').length !== null &&
            date_range.setStartDate !== null
            ? 'activated'
            : ''
        }
        key={400}
        noView={true}
        view={<Button type="default">Choose Date</Button>}
        popup={
          <DateRangePicker
            startDateId="startDate-id-category"
            endDateId="endDate-id-category"
            startDate={
              date_range.setStartDate
                ? moment(date_range.setStartDate, 'MM-DD-YYYY')
                : null
            }
            endDate={
              date_range.setEndDate
                ? moment(date_range.setEndDate, 'MM-DD-YYYY')
                : null
            }
            numberOfMonths={1}
            small={true}
            item={calenderItem}
            updateSearchData={(value) => onChange(value, 'date_range')}
          />
        }
      />

      <ViewWithPopup
        className={
          price.min === price.defaultMin && price.max === price.defaultMax
            ? ''
            : 'activated'
        }
        key={300}
        noView={true}
        view={
          <Button type="default">
            {price.min > 0 || price.max < 100
              ? `Price: ${price.min}, ${price.max}`
              : `Price per night`}
          </Button>
        }
        popup={
          <Slider
            range
            marks={priceInit}
            min={price.defaultMin}
            max={price.defaultMax}
            defaultValue={[price.min, price.max]}
            onAfterChange={(value) => onChange(value, 'price')}
          />
        }
      />

      <ViewWithPopup
        key={200}
        noView={true}
        className={countRoom || countGuest ? 'activated' : ''}
        view={
          <Button type="default">
            Room {countRoom > 0 && `: ${countRoom}`}, Guest
            {countGuest > 0 && `: ${countGuest}`}
          </Button>
        }
        popup={
          <RoomGuestWrapper>
            <ItemWrapper>
              <strong>Room</strong>
              <InputIncDec
                id="room"
                increment={() => setRoom((countRoom) => countRoom + 1)}
                decrement={() =>
                  setRoom((countRoom) => countRoom > 0 && countRoom - 1)
                }
                onChange={(e) => setRoom(e.target.value)}
                value={countRoom}
              />
            </ItemWrapper>

            <ItemWrapper>
              <strong>Guest</strong>
              <InputIncDec
                id="guest"
                increment={() => setGuest((countGuest) => countGuest + 1)}
                decrement={() =>
                  setGuest((countGuest) => countGuest > 0 && countGuest - 1)
                }
                onChange={(e) => setGuest(e.target.value)}
                value={countGuest}
              />
            </ItemWrapper>

            <ActionWrapper>
              {countRoom || countGuest ? (
                <Button type="default" onClick={handleRoomGuestCancel}>
                  Clear
                </Button>
              ) : (
                ''
              )}
              <Button type="primary" onClick={handleRoomGuestApply}>
                Apply
              </Button>
            </ActionWrapper>
          </RoomGuestWrapper>
        }
      /> */}
      <div className="view_with__popup">
        <div className="popup_handler">
          <Button type="default" onClick={onSearchReset}>
            Limpiar filtros
          </Button>
        </div>
      </div>
    </CategorySearchWrapper>
  );
};

export default CategorySearch;
