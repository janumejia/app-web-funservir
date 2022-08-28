import { useState, useReducer, useEffect } from 'react';

// Aquí hacemos la solicitud a nuestra API (backend) usando Fetch API. Info sobre Fetch API: https://www.escuelafrontend.com/articulos/data-fetching-con-react
async function SuperFetch(
  url,
  method = 'GET',
  // Configuración del encabezado de la petición:
  headers = {
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  body = {}
) {
  let options = {
    method,
    headers,
  };
  if (method === 'POST' || method === 'PUT') options = { ...options, body };

  // authentication
  // we will had custom headers here.

  return fetch(url, options) // ⬅️ 1) llamada a la API, el resultado es una Promise
    .then((res) => { 
      return Promise.resolve(res.json()); // ⬅️ 2) cuando la petición finalice, transformamos la respuesta a JSON (res.json() también es una Promise)
    })
    .catch((error) => Promise.reject(error));  // La promesa fallará solo si hay fallos de red o si algo impidió completar la solicitud.
}

// Reducer (describe como una action transforma el state)
// Este reducer es para los diferentes estados de la página durante una solicitud a la API: Cargado página - Cargado exitoso de la página - Error en la recuperación de los datos
function dataFetchReducer(state, action) {
  switch (action.type) {
    
    // Para que aparezca cargado la página, inmediatamente después que se hace la petición a la API
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: false,
      };
    
    // En caso de respuesta exitosa. Ya no aparecerá cargando la página
    case 'FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload.slice(0, state.limit),
        total: action.payload,
        loading: false,
        error: false,
      };

    // En Caso de fallo.
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: true,
      };
    
    // Cargar más.
      case 'LOAD_MORE':
      return {
        ...state,
        data: [
          ...state.data,
          ...state.total.slice(
            state.data.length,
            state.data.length + state.limit
          ),
        ],
        loading: false,
        error: false,
      };
    default:
      throw new Error();
  }
}

// Aquí llega la URL a la cual le haremos la petición a la API para traer los sitios de interés
const useDataApi = (initialUrl, limit = 10, initialData = []) => {
  const [url, setUrl] = useState(initialUrl);

  // Para usar redux. El dispatch es como si fuera "setState"
  const [state, dispatch] = useReducer(dataFetchReducer, {
    loading: false,
    error: false,
    data: initialData,
    total: initialData,
    limit: limit,
  });

  // useEffect se ejecuta cada vez que cambia la URL
  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await SuperFetch(url);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);
  const loadMoreData = () => {
    dispatch({ type: 'LOAD_MORE' });
  };
  const doFetch = (url) => {
    setUrl(url);
  };

  return { ...state, doFetch, loadMoreData };
};

export default useDataApi;
