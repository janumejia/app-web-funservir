export function createUrl(urlData) {
  const keys = Object.keys(urlData);
  let search = '?';
  keys.forEach((key) => {
    if (urlData[key] !== null && urlData[key] !== '') {
      search += `${key}=${urlData[key]}&`;
    }
  });
  return search.substring(0, search.length - 1);
}

export function getUrl(location) {
  // const location = location;
  const data =
    process.browser && location.search
      ? location.search.slice(location.search.indexOf('?') + 1).split('&')
      : [];
  const urlData = {};
  data.forEach((data) => {
    try {
      data = data.split('=');
      const dataVal = decodeURIComponent(data[1]);
      urlData[data[0]] = dataVal;
    } catch (e) { }
  });
  return urlData;
}

export function setStateToUrl(state) {
  console.log(state, 'state');
  let urlData = {};
  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      switch (key) {
        // case 'date_range':
        //   let data = Object.values(state[key]);
        //   if (data[0] === null && data[1] === null) {
        //     data = '';
        //   }
        //   urlData[key] = data && data.length ? data.join() : null;
        //   break;
  
        case 'elementos':
          console.log("state[key]*** -> ", state[key])
          urlData[key] =
            state[key] && state[key].length ? state[key].join() : null;
          break;
        case 'categoria':
          urlData[key] =
            state[key] && state[key].length ? state[key].join() : null;
          break;
        case 'ubicacion':
          urlData[key] = state[key] ? state[key] : null;
          // if (state[key]) {
          // } else {
          //   urlData[key] = '';
          // }
          break;
        // case 'guest':
        //   if (state[key]) {
        //     urlData[key] = state[key] ? state[key] : 0;
        //   } else {
        //     urlData[key] = '';
        //   }
        //   break;
        // case 'price':
        //   urlData[key] =
        //     state[key] && state[key].length ? state[key].join() : null;
        //   break;
        case 'location':
          if (state[key] && state[key].lat) {
            urlData[`${key}_lat`] = state[key].lat;
          }
          if (state[key] && state[key].lng) {
            urlData[`${key}_lng`] = state[key].lng;
          }
          break;
        case 'reset':
          console.log("state prev light: ", state)
          urlData["elementos"] = null;
          urlData["categoria"] = null;
          urlData["ubicacion"] = null;
          console.log("RESET LIGHT YEARRR")
          // urlData = state[key];
          break;

        default:
          urlData[key] = state[key];
          break;
      }
    }
  }
  return createUrl(urlData);
}

export function getStateFromUrl(location) {
  const urlData = getUrl(location);
  const state = {};

  for (const key in urlData) {
    if (urlData.hasOwnProperty(key)) {
      switch (key) {
        // case 'date_range':
        //   const date = urlData[key] ? urlData[key] : null;
        //   if (date) {
        //     let splitDate = date ? date.split(',') : null;
        //     let setStartDate = splitDate ? splitDate[0] : null;
        //     let setEndDate = splitDate ? splitDate[1] : null;
        //     state[key] = date
        //       ? { setStartDate: setStartDate, setEndDate: setEndDate }
        //       : null;
        //   }
        //   break;
        // case 'buscar':
        //   urlData[key] = state[key] ? state[key] : [];
        //   break; 

        case 'elementos':
          console.log("urlData[key]: ", urlData[key])
          state[key] =
            urlData[key] && urlData[key] !== 'null'
              ? urlData[key].split(',')
              : [];
          console.log("NUEVO state[key]: ", state[key])
          break;

        case 'categoria':
          state[key] =
            urlData[key] && urlData[key] !== 'null'
              ? urlData[key].split(',')
              : [];
          break;

        case 'ubicacion':
          state[key] = urlData[key] ? urlData[key] : [];
          // if (urlData[key]) {
          // } else {
          //   state[key] = '';
          // }
          break;

        // case 'guest':
        //   if (urlData[key]) {
        //     state[key] = urlData[key] ? urlData[key] : 0;
        //   } else {
        //     state[key] = '';
        //   }
        //   break;

        // case 'property':
        //   state[key] =
        //     urlData[key] && urlData[key] !== 'null'
        //       ? urlData[key].split(',')
        //       : [];
        //   break;

        // case 'price':
        //   const defaultPrice = {
        //     min: 0,
        //     max: 100,
        //     defaultMin: 0,
        //     defaultMax: 100,
        //   };
        //   const price = urlData[key] ? urlData[key].split(',') : defaultPrice;
        //   if (price) {
        //     let min, max;
        //     min = price ? Number(price[0]) : 0;
        //     max = price ? Number(price[1]) : 100;
        //     if (min > 0 || max < 100) {
        //       state[key] = {
        //         min: min,
        //         max: max,
        //         defaultMin: 0,
        //         defaultMax: 100,
        //       };
        //     } else {
        //       state[key] = '';
        //     }
        //   }
        //   break;

        // case 'location_lat':
        //   if (urlData['location_lat']) {
        //     state['location'] = {};
        //     state['location']['lat'] = Number(urlData[key]);
        //   } else {
        //     state['location'] = null;
        //   }
        //   break;

        // case 'location_lng':
        //   if (urlData[key]) {
        //     state['location']['lng'] = Number(urlData[key]);
        //   }
        //   break;

        // case 'page':
        //   if (urlData[key]) {
        //     state['page'] = Number(urlData[key]);
        //   }
        //   break;

        // case 'limit':
        //   if (urlData[key]) {
        //     state['limit'] = Number(urlData[key]);
        //   }
        //   break;

        default:
          state[key] = urlData[key];
          break;
      }
    }
  }
  return state;
}
