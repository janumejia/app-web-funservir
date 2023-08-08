import React, { useContext, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';
import { Button, Slider, Checkbox, Space, Select } from 'antd';
import ViewWithPopup from 'components/UI/ViewWithPopup/ViewWithPopup';
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

const CategorySearch = ({ location }) => {
  let navigate = useNavigate();

  const { allElements, allNeighborhoods, allLocations, allCategories } = useContext(OtherVariablesContext)

  console.log("allElements: ", allElements)


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
  };


  const { buscar, elementos, categoria, ubicacion, localidad } = state;
  // const [countRoom, setRoom] = useState(room);
  // const [countGuest, setGuest] = useState(guest);

  const onChange = (value, type) => {
    console.log("Elementos: ", elementos);
    console.log("value: ", value, " type: ", type)

    const query = {
      ...state,
      [type]: value,
    };
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

    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
  };

  return (
    <CategorySearchWrapper>
      <ViewWithPopup
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

      <ViewWithPopup
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

      <ViewWithPopup
        className={ubicacion.length ? 'activated' : ''}
        key={"ubicacion"}
        noView={true}
        view={
          <Button type="default">
            Ubicación
            {ubicacion.length > 0 && `: ${ubicacion.length}`}
          </Button>
        }
        popup={
          <Space wrap>
            <Select
              showSearch
              style={{
                'width': '238px',
                'margin': '0 0 10px 0',
              }}
              placeholder="Selecciona una localidad"
              onChange={(value) => {
                try {
                  onChange(value, 'ubicacion');
                  console.log("onchange ubicacion");
                } catch (error) {
                  console.error("Error in onchange ubicacion:", error);
                }
              }}
              options={allLocations.map((locality) => ({
                label: locality.name,
                value: locality.name.replace(/ /g, '-'),
              }))}
            />

            <Select
              showSearch
              style={{
                width: '238px',
              }}
              placeholder="Selecciona un barrio"
              // onChange={(value) => onChange(value, 'neighborhoods')}
              options={allNeighborhoods.map((neighborhood) => ({
                label: neighborhood.name,
                value: neighborhood.name.replace(/ /g, '-'),
              }))}
            />
            {/* <Select
              style={{
                width: 60,
              }}
              value={ubicacion.locality}
              onChange={(value) => onChange(value, 'ubicacion')}
              options={allNeighborhoods.map((city) => ({
                label: city,
                value: city,
              }))}
            /> */}
          </Space>
        }
      />

      {/* <ViewWithPopup
        className={ubicacion.length ? 'activated' : ''}
        key={"Abierto"}
        noView={true}
        view={
          <Button type="default">
            Abierto ahora
            {ubicacion.length > 0 && `: ${ubicacion.length}`}
          </Button>
        }
        popup={
          <Checkbox.Group
            options={allElements.map((element) => {
              return { label: element?.name, value: element?.name }
            })}
            defaultValue={ubicacion}
            onChange={(value) => onChange(value, 'ubicacion')}
          />
        }
      /> */}

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
