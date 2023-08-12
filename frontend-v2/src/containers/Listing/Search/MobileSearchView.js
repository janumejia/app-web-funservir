import React, { useContext, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';
import { Slider, Button, Drawer, Checkbox } from 'antd';
import Heading from 'components/UI/Heading/Heading';
import DateRangePicker from 'components/UI/DatePicker/ReactDates';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import { setStateToUrl, getStateFromUrl } from './url-handler';
import { LISTING_POSTS_PAGE } from 'settings/constant';
import { IoIosArrowDown } from 'react-icons/io';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Select from 'react-select'

import {
  priceInit,
  calenderItem,
  getAmenities,
  getPropertyType,
} from './SearchParams';
import {
  FilterArea,
  FilterElementsWrapper,
  ButtonGroup,
  RoomGuestWrapper,
  ItemWrapper,
  BestRakingArea,
} from './MobileSearchView.style';

import { OtherVariablesContext } from 'context/OtherVariablesProvider';

const FilterDrawer = ({ history, location }) => {
  const { allElements, allNeighborhoods, allLocations, allCategories } = useContext(OtherVariablesContext)

  let navigate = useNavigate();
  const searchParams = getStateFromUrl(location);
  const [toggle, setToggle] = useState(false);
  const [amenities, setAmenities] = useState(searchParams.elementos || []);
  const [propertyType, setPropertyType] = useState(searchParams.categoria || []);
  const [ubicacion, setUbicacion] = useState(searchParams.ubicacion || []);

  const [locality, setLocality] = useState(searchParams.ubicacion && /^[^,]+,[^,]*$/.test(searchParams.ubicacion) ? searchParams.ubicacion.split(",")[0] : null);
  const [neighborhood, setNeighborhood] = useState(searchParams.ubicacion && /^[^,]*,[^,]+$/.test(searchParams.ubicacion) ? searchParams.ubicacion.split(",")[1] : null);

  const [bestRankingFilter, setBestRankingFilter] = useState(searchParams.mejorCalificacion && searchParams.mejorCalificacion === "si" ? true : false);

  const [searchDate, setSearchDate] = useState(
    searchParams.date_range || {
      setStartDate: null,
      setEndDate: null,
    }
  );
  const [price, setPrice] = useState(
    searchParams.price || {
      min: 0,
      max: 100,
      defaultMin: 0,
      defaultMax: 100,
    }
  );
  const roomAndGuest = {
    room: searchParams && searchParams.room ? parseInt(searchParams.room) : 0,
    guest:
      searchParams && searchParams.guest ? parseInt(searchParams.guest) : 0,
  };
  const [roomGuest, setRoomGuest] = useState(
    roomAndGuest || {
      room: 0,
      guest: 0,
    }
  );
  const handleToggleDrawer = () => {
    setToggle(!toggle);
  };
  const onChangeAmenity = (checkedAmenityValue) => {
    setAmenities(checkedAmenityValue);
  };
  const onChangeProperty = (checkedValue) => {
    let result = checkedValue + ",";
    setUbicacion(result);
  };

  const handleApplyFilter = () => {
    let ubicacion = "";
    ubicacion = (locality && locality.length > 0) ? locality : "";
    ubicacion = (neighborhood && neighborhood.length > 0) ? (ubicacion + "," + neighborhood) : (ubicacion + ",");

    const search = setStateToUrl({
      buscar: searchParams.buscar ? searchParams.buscar : "",
      elementos: amenities,
      categoria: propertyType,
      ubicacion: ubicacion,
      mejorPuntuacion: bestRankingFilter ? "si" : "no"
      // date_range: searchDate,
      // ...roomGuest,
    });
    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
    setToggle(false);
  };
  const handleCloseDrawer = () => {
    setBestRankingFilter(false);
    setLocality(null);
    setNeighborhood(null);
    setStateToUrl(null);
    setAmenities([]);
    setPropertyType([]);
    setSearchDate({
      setStartDate: null,
      setEndDate: null,
    });
    setPrice({
      min: 0,
      max: 100,
      defaultMin: 0,
      defaultMax: 100,
    });
    setRoomGuest({
      room: 0,
      guest: 0,
    });
    setToggle(false);

    let search = {};
    if (searchParams.buscar.length !== 0) search = setStateToUrl({ buscar: searchParams.buscar });
    else search = setStateToUrl({ reset: '' });

    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });

  };

  const setOptions = () => {
    return allNeighborhoods.map((neighborhoodE) => {
      if (locality && locality.length > 0) {
        // if (selectedLocality && selectedLocality.label && selectedLocality.label.length > 0) {
        if (neighborhoodE.associatedLocality === locality) {
          return {
            label: neighborhoodE.name,
            value: neighborhoodE.name.replace(/ /g, '-'),
          }
        }
      }
      else {
        return {
          label: neighborhoodE.name,
          value: neighborhoodE.name.replace(/ /g, '-'),
        }
      }
    }).filter(option => option); // Remove any undefined options
  }

  const theOptions = setOptions();

  // Agregada para que no aparezca el botón de filtro en la página de resultados de sitios
  // return <></>

  return (
    <FilterArea>
      <Button className={toggle ? 'active' : ''} onClick={handleToggleDrawer}>
        Más filtros
      </Button>
      <Drawer
        className="filter_drawer"
        height="100vh"
        placement="bottom"
        closable={false}
        maskClosable={false}
        onClose={handleCloseDrawer}
        visible={toggle}
        maskStyle={{ backgroundColor: 'transparent' }}
      >
        <FilterElementsWrapper>
          <Accordion allowZeroExpanded={true}>
            {/* Start price range filter element */}
            {/* <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Heading as="h4" content="Selecciona elementos inclusivos" />
                  <IoIosArrowDown />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <Slider
                  range
                  marks={priceInit}
                  min={price.defaultMin}
                  max={price.defaultMax}
                  value={[price.min, price.max]}
                  onChange={handlePriceChange}
                />
              </AccordionItemPanel>
            </AccordionItem> */}
            {/* End of price range filter element */}

            {/* Start date filter element */}
            {/* <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Heading as="h4" content="Categorías" />
                  <IoIosArrowDown />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <DateRangePicker
                  startDateId="startDate-id-mobile"
                  endDateId="endDate-id-mobile"
                  startDate={
                    searchDate.setStartDate
                      ? moment(searchDate.setStartDate, 'MM-DD-YYYY')
                      : null
                  }
                  endDate={
                    searchDate.setEndDate
                      ? moment(searchDate.setEndDate, 'MM-DD-YYYY')
                      : null
                  }
                  numberOfMonths={1}
                  small={true}
                  item={calenderItem}
                  updateSearchData={(value) =>
                    updateSearchDataFunc(value, 'date_range')
                  }
                />
              </AccordionItemPanel>
            </AccordionItem> */}
            {/* End of date filter element */}

            {/* Start amenities filter element */}
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Heading as="h4" content="Ubicación" />
                  <IoIosArrowDown />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div>
                  <Select
                    // style={{ "align-content": "center", "align-items": "center", "align-self": "center", "align-tracks": "center" }}
                    isSearchable={true}
                    isClearable={true}
                    placeholder="Selecciona una localidad"
                    defaultValue={() => {
                      if (locality  && typeof locality === "string") {
                        const locationName = locality.replace(/-/g, ' ');
                        const foundLocation = allLocations.find(element => element.name === locationName);

                        if (foundLocation) {
                          const formattedName = foundLocation.name.replace(/ /g, '-');
                          return { label: foundLocation.name, value: formattedName };
                        }
                      }

                      return null;
                    }}
                    value={locality ? { label: locality.replace(/-/g, ' '), value: locality } : null}
                    onChange={(valueSelect) => {
                      if (valueSelect) {
                        setLocality(valueSelect.value);
                        setNeighborhood(null);
                      } else {
                        setLocality(null);
                      }
                      console.log(valueSelect)
                      try {
                        // onChange(valueSelect, 'ubicacion', 'localidad');
                      } catch (error) {
                        console.error("Error in onchange ubicacion:", error);
                      }
                    }}
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
                      if (neighborhood && typeof neighborhood === "string") {
                        const neighborhoodName = neighborhood.replace(/-/g, ' ');
                        const foundNeighborhood = allNeighborhoods.find(element => element.name === neighborhoodName);

                        if (foundNeighborhood) {
                          const formattedName = foundNeighborhood.name.replace(/ /g, '-');
                          return { label: foundNeighborhood.name, value: formattedName };
                        }
                      }

                      return null;
                    }}
                    value={neighborhood ? { label: neighborhood.replace(/-/g, ' '), value: neighborhood } : null}

                    onChange={(valueSelect) => {
                      if (valueSelect) {
                        setNeighborhood(valueSelect.value);
                      } else {
                        setNeighborhood("");
                      }
                      console.log(valueSelect)
                      try {
                        // onChange(valueSelect, 'ubicacion', 'barrio');
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
                {/* <Checkbox.Group
                  options={allCategories.map((element) => {
                    return { label: element?.name, value: element?.name.replace(/ /g, '-') }
                  })}
                  value={propertyType}
                  onChange={onChangeAmenity}
                /> */}
              </AccordionItemPanel>
            </AccordionItem>
            {/* End of amenities filter element */}

            {/* Start amenities filter element */}
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Heading as="h4" content="Elementos inclusivos" />
                  <IoIosArrowDown />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <Checkbox.Group
                  options={allElements.map((element) => {
                    return { label: element?.name, value: element?.name.replace(/ /g, '-') }
                  })}
                  value={amenities}
                  onChange={onChangeAmenity}
                />
              </AccordionItemPanel>
            </AccordionItem>
            {/* End of amenities filter element */}

            {/* Start amenities filter element */}
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Heading as="h4" content="Categoría" />
                  <IoIosArrowDown />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <Checkbox.Group
                  options={allCategories.map((element) => {
                    return { label: element?.name, value: element?.name.replace(/ /g, '-') }
                  })}
                  value={propertyType}
                  onChange={onChangeProperty}
                />
              </AccordionItemPanel>
            </AccordionItem>
            {/* End of amenities filter element */}


            <BestRakingArea>
              <Button className={bestRankingFilter ? 'active' : ''} onClick={() => setBestRankingFilter(!bestRankingFilter)}>
                {/* <Heading as="h4" content="Mejor calificación primero" /> */}
                Mejor calificación primero
                {/* <IoIosArrowDown /> */}
              </Button>
            </BestRakingArea>

            {/* Start property type filter element */}
            {/* <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Heading as="h4" content="Property Type" />
                  <IoIosArrowDown />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <Checkbox.Group
                  options={getPropertyType.options}
                  value={propertyType}
                  onChange={onChangeProperty}
                />
              </AccordionItemPanel>
            </AccordionItem> */}
            {/* End of property type filter element */}

            {/* Room & Guest type filter element */}
            {/* <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <Heading as="h4" content="Choose Room and Guest" />
                  <IoIosArrowDown />
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
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
              </AccordionItemPanel>
            </AccordionItem> */}
            {/* End of Room & Guest type filter element */}

          </Accordion>

          <ButtonGroup>
            <Button onClick={handleCloseDrawer}>Limpiar filtros</Button>
            <Button type="primary" onClick={handleApplyFilter}>
              Aplicar filtro
            </Button>
          </ButtonGroup>
        </FilterElementsWrapper>
      </Drawer>
    </FilterArea>
  );
};

export default FilterDrawer;
