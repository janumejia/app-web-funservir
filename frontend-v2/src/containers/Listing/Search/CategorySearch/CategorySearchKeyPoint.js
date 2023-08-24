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
import { LISTING_KEYPOINTS_PAGE, LISTING_POSTS_PAGE } from 'settings/constant';
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


const CategorySearchKeyPoint = ({ location }) => {
  let navigate = useNavigate();

  const searchParams = getStateFromUrl(location);
  const state = {
    elementos_inclusivos: searchParams.elementos_inclusivos || "si",
    barreras_arquitectonicas: searchParams.barreras_arquitectonicas || "si",
  };


  const [elements, setElements] = useState(searchParams.elementos_inclusivos === "si" ? true : false);
  const [barriers, setBarriers] = useState(searchParams.barreras_arquitectonicas === "si" ? true : false);

  const onChange = (value, type) => {
    // console.log("Elementos: ", elementos);
    console.log("value: ", value, " type: ", type)

    let query = {};
    if (type === 'elementos_inclusivos' || type === 'barreras_arquitectonicas') {
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
    } else {
      query = {
        ...state,
        [type]: value,
      };
    }

    const search = setStateToUrl(query);
    console.log("LA NUEVA SEARCH EN CATEGORY: ", search)
    navigate({
      pathname: LISTING_KEYPOINTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
  };

  useEffect(() => {
    if (elements) onChange(true, 'elementos_inclusivos');
    else {
      if(!barriers) { // Para asegurar que siempre esté seleccionada al menos una opción
        setBarriers(true);
        onChange(true, 'barreras_arquitectonicas');
      }
      onChange(false, 'elementos_inclusivos');
    } 
  }, [elements])

  useEffect(() => {
    if (barriers) onChange(true, 'barreras_arquitectonicas');
    else {
      if(!elements) { // Para asegurar que siempre esté seleccionada al menos una opción
        setElements(true);
        onChange(true, 'elementos_inclusivos');
      }
      onChange(false, 'barreras_arquitectonicas');
    }
  }, [barriers])

  return (
    <CategorySearchWrapper>

      <div className={"view_with__popup" + (elements ? ' activatedElements' : '')}>
        <div className="popup_handler">
          <Button type="default" onClick={() => setElements(!elements)}>
            Elementos inclusivos
          </Button>
        </div>
      </div>

      <div className={"view_with__popup" + (barriers ? ' activatedBarriers' : '')}>
        <div className="popup_handler">
          <Button type="default" onClick={() => setBarriers(!barriers)}>
            Barreras arquitectónicas
          </Button>
        </div>
      </div>

    </CategorySearchWrapper>
  );
};

export default CategorySearchKeyPoint;
